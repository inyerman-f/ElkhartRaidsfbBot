const Clarifai = require('clarifai');
const configs = require('./getConfigs');


// initialize with your api key. This will also work in your browser via http://browserify.org/
const app = new Clarifai.App({
    apiKey: configs.ClarifaiAPIKey,
});


module.exports = {
    app,
};