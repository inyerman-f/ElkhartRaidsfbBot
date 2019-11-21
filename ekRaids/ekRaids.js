const
    axios = require('axios'),
    imgProcessor = require('./processors/imgMessage'),
    txtProcessor = require('./processors/txtMessage'),
    discord = require('./utils/discUtils'),
    configs = require('./getConfigs'),
    consts = require('./consts/declareGlobalConstants');
    const {Wit, log} = require('node-wit');
    const witClient = new Wit({accessToken: configs.witAIToken});




/**
 * Process received text and log to raid site
 * @param messageText
 * @param raid_tier
 * @returns {Promise<string|{boss_name, hatched, gym_name, end_time, raid_tier}|*>}
 */
async function processTextMessage(messageText){

    console.log(messageText,'@ekRaids/processTextMessage()','var-value');
  
    let raid_regexp = await txtProcessor.findRegexpMatch(messageText);

    if(raid_regexp === 'no-regexp-found')
    {
            console.log(raid_regexp,'no regexp found','@ekRaids/processTextMessage()/if(raid_regexp === no-regexp-found)','var-value');
            return raid_regexp;
    }
    else
    {
        console.log(raid_regexp,'@ekRaids/processTextMessage()','var-value');

        let raid_data = await txtProcessor.getRaidData(messageText,raid_regexp);
        console.log(raid_data,'@ekRaids/processTextMessage()/else');
        if (raid_data && raid_data!=='could-not-find-cleanup-regexp')
        {
          // let raid_tier = await getTierByBossName(raid_data.boss_name);
           //console.log(raid_tier);
           let resp = '';

            if(raid_data.tier){
                    resp = await logRaid(raid_data.boss_name, raid_data.gym_name, raid_data.end_time, raid_data.hatched, raid_data.type,raid_data.tier);
            }else{

                 resp = await logRaid(raid_data.boss_name, raid_data.gym_name, raid_data.end_time, raid_data.hatched, raid_data.type,'');
            }
            console.log(resp,'resp @ekRaids/processTextMessage()');
            if (resp)
            {
                return resp;
            }
        }
    }

}module.exports.processTextMessage = async function(messageText) {

    return await processTextMessage(messageText);

};


/**
 *
 * @param img_url
 * @returns {Promise<{raid_lvl: *, dato: *}[]>}
 */
async function processImgMessage(img_url){

    let respuesta;
    let imgData = await imgProcessor.getVisionResponse(img_url);
    //console.log('este',imgData);
    //let isRaidEgg;
    
    let witresp = await eKRaids.send2Wit(imgData);
       witresp = witresp['entities'];

    let witProssResp = await proccessWitTxt(witresp);
        respuesta = witProssResp;
        console.log(respuesta,'---at respuesta')

    


    return respuesta;


}module.exports.processImgMessage = async function(img_url){
    return await processImgMessage(img_url);
};

/**
 *
 * @param url
 * @param data
 * @returns {Promise<void>}
 */
async function axios_push(url, data){
    await axios.post(url, data)
        .then((res) => {
           // console.log(`statusCode: ${res.status}`,data);
           console.log(res.status,data);
        });
}module.exports.axios_push = async function(url,data){
    await axios_push(url,data);
};

/**
 */
async function getTierByBossName(boss_name){

  let raid_tier = await axios.get(consts.getBossTier+boss_name).then( response => {
        raid_tier = response.data;
       //push_msg(boss_name+' axiosBossNameResponse','@ekRaids/logRaid()/boss_name','var-value');
        return raid_tier;
    }).catch(error => {
        console.error(error);
    });

}module.exports.getTierByBossName = async function(boss_name){
    
    await getTierByBossName(boss_name);

};

/**
 *
 * @param msg
 * @param location
 * @param type
 * @returns {Promise<void>}
 */
async function push_msg(msg,location,type){

    let mensaje = msg;
    let url = 'https://elkhartraids.website/api/bot/create';
    let data = {user: type, message: mensaje, channel: location};
    await axios_push(url, data);

}module.exports.push_msg = async function(msg,location,type){
  await push_msg(msg,location,type);
};

/**
 *
 * @param url
 * @returns {Promise<string>}
 */
async function download_image(url){
    console.log(url,'@download_image start of function');
    console.log(url,'@download_image start of function. Post trimming');
    const date = new Date();
    let time_stamp = date.getMilliseconds();
    let exec = require('child_process').exec;
    let filename = url.substring(url.lastIndexOf('/')+1);
        filename = filename.replace(/\?.*/g,'').replace(/'/g,'');
    let culie = 'curl "'+url+'" --output ./public/assets/'+time_stamp+filename;

    let dl_status = await exec(culie, (err, stdout, stderr) => {
        if (err) {
            return;
            // node couldn't execute the command
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        return true;
    });

    if (dl_status){
        return 'public/assets/'+time_stamp+filename;
    }
}module.exports.download_image = async function (url){
 return  await  download_image(url);
};

/**
 *
 * @param boss_name
 * @param gym_name
 * @param end_time
 * @param hatched
 * @param type
 * @param raid_tier
 * @returns {Promise<string|{boss_name: *, hatched: *, gym_name: *, end_time: *, raid_tier: *}>}
 */
async function logRaid(boss_name,gym_name,end_time,hatched,type,raid_tier){
    console.log(boss_name,gym_name,type,raid_tier);
   //let raid_tier ='';
   gym_name = await axios.get(consts.gymNameByAliasUrl+gym_name).then( response => {
        gym_name = response.data;
        //push_msg(gym_name+' axiosGymNameResponse','@ekRaids/logRaid()/gym_name','var-value');
        return gym_name;
    }).catch(error => {
        console.error(error);
    });

   if(!boss_name === 'tbd'){
       
        boss_name = await axios.get(consts.monNameByAliasUrl+boss_name).then( response => {
                boss_name = response.data;
            //push_msg(boss_name+' axiosBossNameResponse','@ekRaids/logRaid()/boss_name','var-value');
                return boss_name;
            }).catch(error => {
                console.error(error);
            });

        raid_tier = await axios.get(consts.getBossTier+boss_name).then( response => {
            raid_tier = response.data;
        //push_msg(boss_name+' axiosBossNameResponse','@ekRaids/logRaid()/boss_name','var-value');
            return raid_tier;
        }).catch(error => {
            console.error(error);
        });
   }


    if ( boss_name === 'not-found')
    {
        console.log('failed-boss-name '+boss_name,'@ekRaids/logRaid()/if(boss_name === not-found)','error-response');
        await push_msg('failed-boss-name '+boss_name,'@ekRaids/logRaid()/if(boss_name === not-found)','error-response');
        boss_name ="";
        return 'failed-boss-name';
    }
    else if( gym_name === 'none-found')
    {
        console.log('failed-gym-name '+gym_name,'@ekRaids/logRaid()/if(gym_name === not-found)','error-response');
        await push_msg('failed-gym-name '+gym_name,'@ekRaids/logRaid()/if(gym_name === not-found)','error-response');
        gym_name ="";
        return 'failed-gym-name';
    }
    else {
        let data = {
            boss_name: boss_name,
            gym_name: gym_name,
            end_time: end_time,
            hatched: hatched,
            raid_tier: raid_tier
        };

    await axios_push(consts.raidCreateUrl, data);
        console.log(data,'@logRaid');
        
        await discord.sen2Discord(gym_name, boss_name, end_time, type, raid_tier);
        gym_name = "";
        boss_name = "";
        return data;
    }

}module.exports.logRaid = async function (boss_name,gym_name,end_time,hatched,type,raid_tier){
    return await logRaid(boss_name,gym_name,end_time,hatched,type,raid_tier);
};

async function send2Wit(message){
let resp;
resp =  witClient.message(message, {})
    .then((data) => {
        //console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
        resp = (data);
        return  resp;
    })
    .catch(console.error);

  return await resp;

}module.exports.send2Wit = async function (message){
    return await send2Wit(message);
};


async function proccessWitTxt(strng){

console.log(strng);
let type;
let raidLvl;
let boss_name;
let location;
let duration;


if(strng['raid_egg_expression']){
        type = 'egg';
        console.log('is an egg ', type);
}
else if (strng['raid_boss'])
{
        type = 'raid';
        console.log('is an raid ', type);
            boss_name = strng['raid_boss'][0].value;
    console.log(boss_name);
}

if(strng['raid_tier'])
{
    raidLvl = strng['raid_tier'][0].value;
    console.log(raidLvl);
}


return type;

}module.exports.proccessWitTxt = async function (strng){
    return await proccessWitTxt(strng);
};