/* jshint node: true, devel: true */
'use strict';

const
      configs = require('./ekRaids/getConfigs'),
      msngr = require('./ekRaids/msngrEvents'),
      bodyParser = require('body-parser'),
      express = require('express'),
      discord = require('./ekRaids/discEventListener');



let app = express();
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: msngr.verifyRequestSignature }));
app.use(express.static('public'));

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res)
{
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === configs.VALIDATION_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res)
{
  let data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      let pageID = pageEntry.id;
      let timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
         msngr.receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
         msngr.receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          msngr.receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
              msngr.receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          msngr.receivedMessageRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          msngr.receivedAccountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL.
 *
 */
app.get('/authorize', function(req, res)
{
  let accountLinkingToken = req.query.account_linking_token;
  let redirectURI = req.query.redirect_uri;

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  let authCode = "1234567890";

  // Redirect users to this URI on successful login
  let redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  });
});

discord.start_discord();

app.listen(app.get('port'), function()
{
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
