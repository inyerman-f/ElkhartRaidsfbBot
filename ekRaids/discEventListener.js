const
    configs = require('./getConfigs'),
    Discord = require('discord.js'),
    discUtils = require('./utils/discUtils'),
    ekRaids = require('../ekRaids/ekRaids'),
    client = new Discord.Client();


async function start_discord()
{
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    await start_msg_listener();

    await client.login(configs.distoken);
}
module.exports.start_discord = async function () 
{
        await start_discord();
}

async function start_msg_listener()
{
client.on('message', msg => {
        console.log(msg.content);//536980354850881569
        if (msg.channel.id === '537064710093144066' || msg.channel.id === '602225767056801864') {

            let attch = msg.attachments.array();
            attch = attch[0];
            let usu = msg.author.id;

            if (usu != '553296188045262848' && !msg.author.bot){
                msg = msg.content;
                msg = msg.toString();
                console.log('a messagem was recivido');
                if (attch === undefined){

                processText(msg);
                console.log(msg,' ----at msg recieved Discord');
                

                }
                else {
                // console.log(attch);
                attch = attch.proxyURL;
                processImg(attch);
                console.log(attch,' -----at img recieved Discord');
                }
            }else{
                console.log('chinche robot...ignoralo');
            }

        }
    });
}

async function processText(txt){

    let  resp = await discUtils.processTextMsg(txt);
    console.log(resp,' ---at txtmsg processing completed');
    client.channels.get('537064710093144066').send('te procese');
}

async function processImg(imgUrl){

    let  resp = await  discUtils.processImageMsg(imgUrl);
    console.log(resp,' -----at img processing completed');
}

/**
 * Announce a raid on pokenav
 * @param mensa
 * @returns {Promise<void>}
 */
async function announce2PokeNav(mensa,canal){
    client.channels.get(canal).send(mensa);
}module.exports.announce2PokeNav = async function (mensa,canal){
 await   announce2PokeNav(mensa,canal);
}