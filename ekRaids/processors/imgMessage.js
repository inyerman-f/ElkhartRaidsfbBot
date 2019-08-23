const axios = require('axios');
const configs = require('../getConfigs');
const ekRaids = require('../ekRaids');
const clarifa = require('../clarifai');
const
    projectId = configs.ekRaidsVisionAmlProject,
    computeRegion ='us-central1',
    modelId = configs.ekRaidsVisionAmlModel,
    scoreThreshold = 0.78;

async function getVisionResponse(img_url)
{
    let vision_request =  {
        "requests": [
            {
                "image": {
                    "source": {
                        "imageUri": img_url
                    }
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    },
                    {
                        "type": "LABEL_DETECTION"
                    }
                ]
            }
        ]
    };
    console.log(vision_request,img_url);
    let dato = '';
        dato = await axios.post('https://vision.googleapis.com/v1/images:annotate?key='+configs.VisionAPIKey,
        vision_request, { responseType: 'text' })
        .then((res) => {
            dato = res.data;
            dato = dato.responses[0].textAnnotations[0].description;
            dato = dato.replace(/(\r\n|\n|\r)/gm," ");
            return dato;
        }).catch(error => {
            console.error(error);
        });
    console.log(dato);
   if(dato){
       return dato;
   }
}module.exports.getVisionResponse = async function (url){
    return await getVisionResponse(url);
};

async function visionPredict(img_path){
    // [START automl_vision_predict]
    const automl = require('@google-cloud/automl').v1beta1;
    const fs = require('fs');

    // Create client for prediction service.
    const client = new automl.PredictionServiceClient();

    const modelFullId = client.modelPath(projectId, computeRegion, modelId);

    // Read the file content for prediction.
    const content = fs.readFileSync(img_path, 'base64');

    const params = {};

    if (scoreThreshold) {
        params.score_threshold = scoreThreshold;
    }

    // Set the payload by giving the content and type of the file.
    const payload = {};
    payload.image = {imageBytes: content};

    // params is additional domain-specific parameters.
    // currently there is no additional parameters supported.
    const [response] = await client.predict({
        name: modelFullId,
        payload: payload,
        params: params,
    });
    console.log(`Prediction results:`);
    response.payload.forEach(result => {
        console.log(`Predicted class name: ${result.displayName}`);
        console.log(`Predicted class score: ${result.classification.score}`);
    });
    return(response);
    // [END automl_vision_predict]
}module.exports.visionPredict = async function(img_path){
    return await visionPredict(img_path);
};

/*
async function checkClarifyRaidScore(image_url)
{
console.log(image_url, '@checkClarifyRaidScore');
let is_raid = '';
await clarifa.app.models.predict(
        {id: configs.ekRaidsClarifaiModel, version: configs.ekRaidsModelVersion},
        image_url).then(
        await function (response) {
                // do something with response
                let concepts = response['outputs'][0]['data']['concepts'];
                let raid_score ='';
                for (let concept in concepts) {
                    if (concepts[concept].name === 'raid') {
                        raid_score = concepts[concept].value;
                        if(raid_score > 0.85){
                            is_raid = true;
                            console.log(concept,raid_score,is_raid,'is raid');
                            return is_raid;
                        }
                    }
                }
            },
            function (err) {
                console.log(err);
            }
        );
    if (is_raid === true)
    {
        console.log(is_raid,'from imgProcessor check at clarifai raid level');
        return is_raid;
    }
    else
    {
        console.log(is_raid);
        return false;
    }
}module.exports.checkClarifyRaidScore = async function (image_url){
  return  await  checkClarifyRaidScore(image_url);
};

async function checkClarifaiRaidLevel(img_url)
{
let val = '';
let nom = '';
await clarifa.app.models.predict(
        {id: configs.ekRaidsClarifaiModel, version: configs.ekRaidsModelVersion},
        img_url).then(
        await function (response) {
            // do something with response
            let concepts = response['outputs'][0]['data']['concepts'];

            for (let concept in concepts) {
                val = concepts[concept].value;
                nom = concepts[concept].name;
                nom = nom.toString();
                if (val > 0.88 && nom.match(/level_.g)) {
                 //   console.log(concepts[concept]);
                    nom = nom.replace('level_', '');
                    console.log(val,nom);
                    return nom;
                   // return  nom.replace('level_', '');
                }else {
                    nom ='';
                }
            }
        },
        function (err) {
            console.log(err);
        }
    );
if(nom){
    return nom;
}

}module.exports.checkClarifaiRaidLevel = async function (img_url){
  return await  checkClarifaiRaidLevel(img_url);
};*/