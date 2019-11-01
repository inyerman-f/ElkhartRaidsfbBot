const
    stAns = require('../consts/standardAnswers'),
    txtProcessor = require('../processors/txtMessage'),
    request = require('request'),
    configs = require('../getConfigs'),
    discord = require('../discEventListener'),
    ekRaids = require('../ekRaids');

async function process_fb_text_msg(messageText,senderId)
{
    sendTypingOn(senderId);
    await ekRaids.push_msg(messageText,'process_fb_text_msg','raidExpression');
    let mensa = messageText.toString().trim().toLowerCase();
    let resp = await ekRaids.processTextMessage(mensa);

    if(resp)
    {
        if(resp === 'failed-boss-name'){
            sendTextMessage(senderId,stAns.standard_answers.english.sorry.could_not_get_boss);
        }else if(resp === 'failed-gym-name'){
            sendTextMessage(senderId,stAns.standard_answers.english.sorry.could_not_get_gym);
        }else if(resp === 'no-regexp-found'){
            sendTextMessage(senderId,stAns.standard_answers.english.sorry.bad_image_processing);
        }else if(resp === 'could-not-find-cleanup-regexp'){
            sendTextMessage(senderId,stAns.standard_answers.english.sorry.bad_image_processing);
        }
        else if(resp.gym_name) {
            send_thanks_for_raid(senderId, resp.gym_name,resp.boss_name, resp.end_time);
        }else {
            sendTextMessage(senderId,stAns.standard_answers.english.greetings.bot_greeting);
        }
        sendTypingOff(senderId);
    }
    else
    {
        sendTextMessage(senderId,stAns.standard_answers.english.sorry.could_not_understand);
        sendTypingOff(senderId);
    }

}module.exports.process_fb_text_msg = async function (messageText,senderId){
    await process_fb_text_msg(messageText,senderId);
};

async function process_fb_image_msg(messageAttachments,senderId)
{
    let img_url = messageAttachments[0];

    img_url = img_url.payload.url;
    //  let process_raid='';
    console.log(img_url+'img_url @fb_img_mg_processor');
    discord.announce2PokeNav({files: [img_url]},'602225767056801864');
    /* let resp = await ekRaids.processImgMessage(img_url);

    console.log(resp);

    let dato = resp[0].dato;
    let raid_lvl =resp[0].raid_lvl;
    console.log(dato,'dato @process_fb_image_msg'); 
    await process_fb_text_msg(dato, senderId, raid_lvl);
    //    console.log('we successfully processed the image');
    */

}module.exports.process_fb_image_msg = async function(messageAttachments,senderId){
    await process_fb_image_msg(messageAttachments,senderId);
};

function sendTextMessage(recipientId, messageText)
{
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            metadata: messageText
        }
    };

    callSendAPI(messageData);
}module.exports.sendTextMessage = function (recipientId, messageText){
    sendTextMessage(recipientId, messageText);
};

function callSendAPI(messageData)
{
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: configs.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);

            }

        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });

}module.exports.callSendAPI = function (messageData){
    callSendAPI(messageData);
};

function send_thanks_for_raid(recipientId,gym_name,boss_name,end_time)
{
    sendTextMessage(recipientId, 'Thanks for reporting a raid for '+boss_name+ ' at '+gym_name+' with '+end_time+' mins left. Your help is much appreciated.');

}module.exports.send_thanks_for_raid = function (recipientId,gym_name,boss_name,end_time){
    send_thanks_for_raid(recipientId,gym_name,boss_name,end_time);
};

/**
 *
 * @param recipientId
 */
function sendTypingOn(recipientId)
{
    console.log("Turning typing indicator on");

    let messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };

    callSendAPI(messageData);
}
module.exports.sendTypingOn = function (recipientId)
{
    sendTypingOn(recipientId);
};

/**
 *
 * @param recipientId
 */
function sendTypingOff(recipientId)
{
    console.log("Turning typing indicator off");

    let messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    callSendAPI(messageData);
}
module.exports.sendTypingOff = function (recipientId)
{
    sendTypingOff(recipientId);
};