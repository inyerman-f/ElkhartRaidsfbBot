const config = require('config');
/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */
// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
    (process.env.MESSENGER_VALIDATION_TOKEN) :
    config.get('validationToken');

/**
 * Facebook page access token
 * @type {string}
 */
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
    (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
    config.get('pageAccessToken');

/**
 *URL where the app is running (include protocol). Used to point to scripts and
 * assets located at this address.
 * @type {string}
 */
const SERVER_URL = (process.env.SERVER_URL) ?
    (process.env.SERVER_URL) :
    config.get('serverURL');

const distoken = (process.env.DISCORD_TOKEN) ?
    process.env.DISCORD_TOKEN:
    config.get('disToken');

const ClarifaiAPIKey = (process.env.ClarifaiAPIKey) ?
    process.env.ClarifaiAPIKey:
    config.get('ClarifaiAPIKey');

const witAIToken = (process.env.witAIToken) ?
    process.env.witAIToken:
    config.get('witAIToken');

const VisionAPIKey = (process.env.VisionAPIKey) ?
    process.env.VisionAPIKey:
    config.get('VisionAPIKey');

const ekRaidsClarifaiModel = (process.env.ekRaidsClarifaiModel) ?
    process.env.ekRaidsClarifaiModel:
    config.get('ekRaidsClarifaiModel');

const ekRaidsClarifaiModelVersion = (process.env.ekRaidsModelVersion) ?
    process.env.ekRaidsModelVersion:
    config.get('ekRaidsModelVersion');

const ekRaidsVisionAmlModel = (process.env.ekRaidsVisionAmlModel) ?
    process.env.ekRaidsModelVersion:
    config.get('ekRaidsVisionAmlModel');
/**
 *
 * @type {string}
 */
const ekRaidsVisionAmlProject = (process.env.ekRaidsVisionAmlProject) ?
    process.env.ekRaidsVisionAmlProject:
    config.get('ekRaidsVisionAmlProject');


if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL))
{
    console.error("Missing config values");
    process.exit(1);
}

module.exports = {
    APP_SECRET,
    VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN,
    SERVER_URL,
    distoken,
    ClarifaiAPIKey,
    VisionAPIKey,
    ekRaidsClarifaiModel,
    ekRaidsClarifaiModelVersion,
    ekRaidsVisionAmlModel,
    ekRaidsVisionAmlProject,
    witAIToken
};