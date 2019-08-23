const regexps = require('../consts/regexps');
const ekRaids = require('../ekRaids');

/**
 *
 * @param messageText | text to be analyzed
 * @param regexp  | regexp used to parse text
 * @returns {Promise<string|{boss_name: *, hatched: *, gym_name: *, end_time: *, type: *}>}
 */
async function getRaidData(messageText,regexp){

    messageText = messageText.trim().toLowerCase();
    messageText = messageText.toString();
    let data ='';
    console.log(messageText,regexp.expression, '@getRaidData');
    if(regexp)
    {
       // let content = getGeneralStatement(mensa,regexp.expression);
        let hatched = regexp.hatched;
        let gen_statement = regexp.name;
        let type = regexp.type;

        if(type ==='raid')
        {
            messageText = messageText.split(regexp.expression);
            console.log(messageText, 'after split @getRaidData/if(regexp)');
            messageText = messageText[regexp.gym] + ' ' + messageText[regexp.cp] + ' ' + messageText[regexp.boss] + ' ' + messageText[regexp.time];
            console.log(messageText,'@getRaidData/if(type===raid');
            messageText = cleanupContent(messageText);
            console.log(messageText, 'general-statement @getRaidData/if(type===raid ' + gen_statement);

            let cleanup_exp = await findCleanUpExpressionMatch(messageText);
            console.log(cleanup_exp,'cleanup regexp @getRaidData/if(type===raid');

            if(cleanup_exp)
            {
                console.log(cleanup_exp.expression,'@txtMessage/getRaidData()/if(type ===raid)/if(cleanup_exp)');
                if(cleanup_exp && cleanup_exp !== 'could-not-find-cleanup-regexp')
                {
                    messageText = messageText.split(cleanup_exp.expression);
                    let boss_name = messageText[cleanup_exp.boss];
                    let gym_name = await cleanGymName(messageText[cleanup_exp.gym]);
                    let end_time = await cleanEndTime(messageText[cleanup_exp.time]);
                    data = {boss_name: boss_name, gym_name: gym_name, end_time: end_time, hatched: hatched, type: type};
                    console.log(data);
                    return data;
                }
            }
            else
            {
                console.log('no cleanup regex was found for:'+messageText,'@txtMessage/getRaidData()/if(type ===raid)/else');
                return 'could-not-find-cleanup-regexp';
            }
        }
    }
    else
    {
        await ekRaids.push_msg(messageText,'getRaidData');
        console.log('no regexp was found');
        return 'failed-no-regexp';
    }

}module.exports.getRaidData = async function (messageText,regexp){
    return await getRaidData(messageText,regexp);
};

/**
 *
 * @param str
 * @returns {Promise<*|expression>}
 */
async function findRegexpMatch(str){

    let general_regexps = regexps.raid_regexps.general_statements.raids;
    str = str.toString();
    let expression = '';

    for (let regexp in general_regexps)
    {
        if (str.match(general_regexps[regexp].expression)) {
            expression = general_regexps[regexp];
            console.log(expression+' regexp found','@txtMessage/findRegexpMatch()/for(general_regexps)/if(str.match())','var-value');
            break;
        }
    }
    if(!expression)
    {
        console.log('no matching general expression was found','@txtMessage/findRegexpMatch()');
        return 'no-regexp-found';
    }
    else
    {
        console.log(expression+' was found as a matching general general expression.','@txtMessage/findRegexpMatch()','var-value');
        return expression;
    }

}module.exports.findRegexpMatch = async function(str){
    return await findRegexpMatch(str);
};

/**
 *
 * @param str
 * @returns {Promise<string>}
 */
async function findCleanUpExpressionMatch(str){

    let cleanup_regexps = regexps.cleanup_exps;
    str = str.toString();
    let cleanup_exp ='';
    for (let regexp in cleanup_regexps) {

        if (str.match(cleanup_regexps[regexp].expression)) {
            console.log('succeeded@findCleanUpExpressionMatch');
            cleanup_exp = cleanup_regexps[regexp];
            break;
        }

    }
    if(cleanup_exp)
    {
        return cleanup_exp;
    }
    else {
        return 'could-not-find-cleanup-regexp';
    }
}module.exports.findCleanUpExpressionMatch = async function(str){
    return await findCleanUpExpressionMatch(str);
};

/**
 * @param content
 * @returns {string}
 */
function cleanupContent(content){
    content = content.toString().replace(/(\r\n|\n|\r)/gm, " ").replace(/(\.)/g, '').trim().toLowerCase();
    return  content;
}module.exports.cleanupContent = function (content){
    return  cleanupContent(content);
};

/**
 *
 * @param gym_name
 * @returns {Promise<string>}
 */
async function cleanGymName(gym_name){
    console.log(gym_name,'@txtMessage/cleanGymName()');
    gym_name = gym_name.toString().replace(/(\(.*?\))/g, '');
    gym_name = gym_name.replace(/(\(.*)/g,'');
    gym_name = gym_name.replace(/(.*lte)/g,'').trim();
    return gym_name;
}module.exports.cleanGymName = async function(gym_name){
    return await cleanGymName(gym_name);
};

async function cleanEndTime(end_time){
    end_time = end_time.replace('0:','');
    end_time = end_time.replace(/(\:\d+)/g,'');
    return end_time;
}

async function capitalize_Words(str){
    str.toString();
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}module.exports.capitalize_Words = async function (str){
   return await capitalize_Words(str);
};