const
    configs = require('./getConfigs'),
    crypto = require('crypto'),
    msngrUtils = require('./utils/msngrUtils');


function verifyRequestSignature(req, res, buf)
{
    let signature = req.headers["x-hub-signature"];

    if (!signature)
    {
        // For testing, let's log an error. In production, you should throw an
        // error.
        console.error("Couldn't validate the signature.");
    }
    else
    {
        let elements = signature.split('=');
        let method = elements[0];
        let signatureHash = elements[1];

        let expectedHash = crypto.createHmac('sha1', configs.APP_SECRET)
            .update(buf)
            .digest('hex');

        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}
module.exports.verifyRequestSignature = function (req, res, buf)
{
    verifyRequestSignature(req, res, buf);
};

/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to
 * Messenger" plugin, it is the 'data-ref' field. Read more at
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfAuth = event.timestamp;

    // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
    // The developer can set this to an arbitrary value to associate the
    // authentication callback with the 'Send to Messenger' click event. This is
    // a way to do account linking when the user clicks the 'Send to Messenger'
    // plugin.
    let passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
        "through param '%s' at %d", senderID, recipientID, passThroughParam,
        timeOfAuth);

    // When an authentication is received, we'll send a message back to the sender
    // to let them know it was successful.
    msngrUtils.sendTextMessage(senderID, "Authentication successful");
}
module.exports.receivedAuthentication = function (event)
{
    receivedAuthentication(event);
};

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
async function receivedMessage(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
    let isEcho = message.is_echo;
    let messageId = message.mid;
    let appId = message.app_id;
    let metadata = message.metadata;


    // You may get a text or attachment but not both
    let messageText = message.text;
    let messageAttachments = message.attachments;

    if (isEcho)
    {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
    }
   else if (messageText)
    {
        await msngrUtils.process_fb_text_msg(messageText,senderID,'');


    }
    else if (messageAttachments)
    {
      await msngrUtils.process_fb_image_msg(messageAttachments,senderID);
    }

}
module.exports.receivedMessage = async function(event)
{
  await  receivedMessage(event);
};

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let delivery = event.delivery;
    let messageIDs = delivery.mids;
   // let watermark = delivery.watermark;
    let sequenceNumber = delivery.seq;

    if (messageIDs) {
        messageIDs.forEach(function(messageID) {
            console.log("Received delivery confirmation for message ID: %s",
                messageID);
        });
    }

    console.log("All message before %d were delivered.");
}
module.exports.receivedDeliveryConfirmation = function(event)
{
    receivedDeliveryConfirmation(event);
};

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    let payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    msngrUtils.sendTextMessage(senderID, "Postback called");
}
module.exports.receivedPostback = function (event)
{
    receivedPostback(event);
};

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
   // let watermark = event.read.watermark;
    let sequenceNumber = event.read.seq;

    console.log("Received message read event for watermark %d and sequence " +
        "number %d", sequenceNumber);
}
module.exports.receivedMessageRead = function (event)
{
    receivedMessageRead(event);
};

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 *
 */
function receivedAccountLink(event)
{
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;

    let status = event.account_linking.status;
    let authCode = event.account_linking.authorization_code;

    console.log("Received account link event with for user %d with status %s " +
        "and auth code %s ", senderID, status, authCode);
}
module.exports.receivedAccountLink = function (event)
{
    receivedAccountLink(event);
};

function requiresServerURL(next, [recipientId, ...args])
{
    if (configs.SERVER_URL === "to_be_set_manually") {
        let messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: `
              We have static resources like images and videos available to test, but you need to update the code you downloaded earlier to tell us your current server url.
              1. Stop your node server by typing ctrl-c
              2. Paste the result you got from running "lt —port 5000" into your config/default.json file as the "serverURL".
              3. Re-run "node app.js"
              Once you've finished these steps, try typing “video” or “image”.
        `
            }
        };

        msngrUtils.callSendAPI(messageData);
    } else {
        next.apply(this, [recipientId, ...args]);
    }
}
module.exports.requiresServerURL = function (next, [recipientId, ...args])
{
    requiresServerURL(next, [recipientId, ...args]);
};

