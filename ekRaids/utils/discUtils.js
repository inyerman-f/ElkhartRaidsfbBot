const
    consts = require('../consts/declareGlobalConstants'),
    axios = require('axios'),
    Discord =require('discord.js'),
    client = new Discord.Client(),
    eKRaids = require('../ekRaids');

/**
 *
 * @param msg
 * @returns {Promise<void>}
 */
async function processTextMsg(msg,raid_lvl){

   let mensa = msg.toString().trim().toLowerCase();
   await eKRaids.push_msg(mensa,'msg @discUtils/processTextMsg()','raidExpression');
   console.log(mensa,'msg @discUtils/processTextMsg()','raidExpression');

   let resp = await eKRaids.processTextMessage(mensa,raid_lvl);
   console.log(resp,'@discUtils/processTextMsg() ');
    if(resp)
    {
        if(resp === 'failed-boss-name')
        {
            console.log('failed to find the boss name','@discUtils/processTextMsg()/if(resp)/if(resp === failed-boss-name)','error-response');
        }
        else if(resp === 'failed-gym-name')
        {
            console.log('failed to find the gym name','@discUtils/processTextMsg()/if(resp)/if(resp === failed-boss-name)/else if(resp === failed-gym-name)','error-response');
        }
        else if(resp === 'no-regexp-found')
        {
            console.log('failed to find a matching regexp','@discUtils/processTextMsg()/if(resp)/if(resp === failed-boss-name)/else if(no-regexp-found)','error-response');
        }
        else if(resp === 'could-not-find-cleanup-regexp')
        {
            console.log('could-not-find-cleanup-regexp','@discUtils/processTextMsg()/if(resp)/if(resp === failed-boss-name)/else if(could-not-find-cleanup-regexp)','error-response');
        }
        else
        {
            console.log('unknown error','');
        }
    }
    else
    {
        console.log('text message could not be processed','@discUtils/processTextMsg()/else','error-response');
       // sendTextMessage(senderId,stAns.standard_answers.english.sorry.could_not_understand);
    }

}module.exports.processTextMsg = async function(msg,raid_lvl){
    await processTextMsg(msg,raid_lvl);
};

/**
 * process a raid image received from discord
 * @param img_url
 * @returns {Promise<void>}
 */
async function processImageMsg(img_url) {

    console.log(img_url, 'var img_url @discUtils/processImageMsg()');
    img_url = img_url.toString();
    let resp = await eKRaids.processImgMessage(img_url);
    console.log(resp, 'var resp @discUtils/processImageMsg()');

    if (resp)
    {
        console.log(resp+' resp', '@discUtils/processImageMsg()/if(resp)','var-value');
        console.log(resp[0].dato, resp[0].raid_lvl, ' @discUtils/processImageMsg()/if(resp)', 'var-value');
        let raid_string = resp[0].dato;
        let raid_lvl = resp[0].raid_lvl;
        await processTextMsg(raid_string, raid_lvl);
    }
    else
    {
        console.log(img_url+' img could not be processed','@discUtils/processImageMsg()/if(resp)/else');
    }
}module.exports.processImageMsg = async function(img_url){
     await processImageMsg(img_url);
};

/**
 * Send Raid data to the pokenav raid channel
 * @param gym_name
 * @param boss_name
 * @param end_time
 * @param type
 * @param raid_tier
 * @returns {Promise<void>}
 */
async function sen2Discord(gym_name,boss_name,end_time,type,raid_tier){
    let mensa = '';
    let gym_id ='';
    gym_name = gym_name.trim();
    if (type == 'raid')
    {
        mensa = '$raid '+boss_name+' "'+gym_name+'" '+end_time+' minutes';
    }
    else
    {
        mensa = '$egg level '+raid_tier+' "'+gym_name+'" '+end_time+' minutes';
    }

    await  axios.get(consts.gymIdByAliasUrl+gym_name).then( response => {
        gym_id = response.data;
    }).catch(error => {
        console.error(error);
    });

    await announce2PokeNav(mensa);
    await announce2PokeNav(consts.raidDeetsUrl+gym_id);


}module.exports.sen2Discord = async function (gym_name,boss_name,end_time,type,raid_tier){
    await   sen2Discord(gym_name,boss_name,end_time,type,raid_tier);
};

/**
 * Announce a raid on pokenav
 * @param mensa
 * @returns {Promise<void>}
 */
async function announce2PokeNav(mensa){
    client.channels.get('606147414587604993').send(mensa);
}module.exports.announce2PokeNav = async function (mensa){
 await   announce2PokeNav(mensa);
};