const
    axios = require('axios'),
    imgProcessor = require('./processors/imgMessage'),
    txtProcessor = require('./processors/txtMessage'),
    configs = require('./getConfigs'),
    consts = require('./consts/declareGlobalConstants');

/**
 * Process received text and log to raid site
 * @param messageText
 * @param raid_tier
 * @returns {Promise<string|{boss_name, hatched, gym_name, end_time, raid_tier}|*>}
 */
async function processTextMessage(messageText,raid_tier){

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
           let resp = await logRaid(raid_data.boss_name, raid_data.gym_name, raid_data.end_time, raid_data.hatched, raid_data.type, raid_tier);
            console.log(resp,'resp @ekRaids/processTextMessage()');
            if (resp)
            {
                return resp;
            }
        }
    }

}module.exports.processTextMessage = async function(messageText,raid_tier) {

    return await processTextMessage(messageText,raid_tier);

};


/**
 *
 * @param img_url
 * @returns {Promise<{raid_lvl: *, dato: *}[]>}
 */
async function processImgMessage(img_url){

    console.log(img_url+' img_url','@ekRaids/processImgMessage()','var-value');
    let dato = '';
    let level ='';

    let img_download_path = await download_image(img_url);
    console.log(img_download_path+' img_download_path post download trigger','@processImgMessage','var-value');

    if(img_download_path)
    {
        level = await  imgProcessor.visionPredict(img_download_path);
        if (level) {
            console.log(level);
            //return null;
            dato =  await imgProcessor.getVisionResponse('./'+img_download_path);

            if(dato){
                console.log([{'dato':dato,'raid_lvl':level}]);
              //  return [{dato:dato,raid_lvl:level}];
            }
        }
    }
    else
    {
        console.log('image url not received');
    }
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
    console.log(boss_name,gym_name);

   gym_name = await axios.get(consts.gymNameByAliasUrl+gym_name).then( response => {
        gym_name = response.data;
        //push_msg(gym_name+' axiosGymNameResponse','@ekRaids/logRaid()/gym_name','var-value');
        return gym_name;
    }).catch(error => {
        console.error(error);
    });

   boss_name = await axios.get(consts.monNameByAliasUrl+boss_name).then( response => {
        boss_name = response.data;
       //push_msg(boss_name+' axiosBossNameResponse','@ekRaids/logRaid()/boss_name','var-value');
        return boss_name;
    }).catch(error => {
        console.error(error);
    });

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
        //await discord.sen2Discord(gym_name, boss_name, end_time, type, raid_tier);
        gym_name = "";
        boss_name = "";
        return data;
    }

}module.exports.logRaid = async function (boss_name,gym_name,end_time,hatched,type,raid_tier){
    return await logRaid(boss_name,gym_name,end_time,hatched,type,raid_tier);
};
