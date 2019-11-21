const
    consts = require('../consts/declareGlobalConstants'),
    axios = require('axios'),
    Discord =require('../discEventListener');
    eKRaids = require('../ekRaids');

/**
 *
 * @param msg
 * @returns {Promise<void>}
 */
async function processTextMsg(msg){

    console.log(msg);

   let resp = await eKRaids.send2Wit(msg);
   console.log('shid worked ', resp);
   return resp;

}module.exports.processTextMsg = async function(msg){
   return await processTextMsg(msg);
};

/**
 * process a raid image received from discord
 * @param img_url
 * @returns {Promise<void>}
 */
async function processImageMsg(img_url) {

    let resp = await eKRaids.processImgMessage(img_url);
    //console.log(resp);
   let raid_string = resp;
    console.log(raid_string,"----derp-----");
   return await raid_string;

    
}module.exports.processImageMsg = async function(img_url){
    return  await processImageMsg(img_url);
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

    await Discord.announce2PokeNav(mensa,'600503061827551262');
    await Discord.announce2PokeNav(consts.raidDeetsUrl+gym_id,'602225767056801864');


}module.exports.sen2Discord = async function (gym_name,boss_name,end_time,type,raid_tier){
    await   sen2Discord(gym_name,boss_name,end_time,type,raid_tier);
};
