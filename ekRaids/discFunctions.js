const
    configs = require('./getConfigs'),
    Discord = require('discord.js'),
    client = new Discord.Client();



function start_discord()
{
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('message', msg => {
        if (msg.channel.id === '536980354850881569' || msg.channel.id === '600716620553519114') {

            //  let attch = msg.attachments.array();
         console.log('fuckyou');

        }
    });

   client.login(configs.distoken);

}
module.exports = {
    start_discord,
    client,
};

function start_msg_listener()
{
    /*
*/
}
