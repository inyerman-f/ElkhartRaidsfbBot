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
}module.exports.start_discord = async function () {
        await start_discord();
};

async function start_msg_listener()
{
client.on('message', msg => {
        console.log(msg.content);
        if (msg.channel.id === '536980354850881569' || msg.channel.id === '600716620553519114') {

            let attch = msg.attachments.array();
            attch = attch[0];
            msg = msg.content;
            msg = msg.toString();

            if (attch === undefined){
                if(msg.match(/.*raid.*/gmi) || msg.match(/.*raid.*/gi)) {
                    discUtils.processTextMsg(msg);
                }
            }
            else {
                console.log(attch);
                attch = attch.proxyURL;
               discUtils.processImageMsg(attch);
              //  console.log(attch);
            }
        }
    });
}
