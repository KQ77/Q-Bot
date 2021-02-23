const dotenv = require('dotenv');
dotenv.config();
// const { WebClient } = require(`@slack/web-api`);
// const { RTMClient } = require('@slack/rtm-api');

// const rtm = new RTMClient(process.env.BOT_TOKEN);
// const web = new WebClient(process.env.BOT_TOKEN);

// try {
//   rtm.start();
// } catch (err) {
//   console.log(err);
// }

// rtm.on('ready', async () => {
//   console.log('bot started');
// });
// var SlackBot = require('slackbots');
// console.log(typeof process.env.BOT_TOKEN, 'bot token');
// // create a bot
// var bot = new SlackBot({
//   token: 'process.env.BOT_TOKEN', // Add a bot https://my.slack.com/services/new/bot and put the token
//   name: 'Q-Bot',
// });

// bot.on('start', function () {
//   // more information about additional params https://api.slack.com/methods/chat.postMessage
//   var params = {
//     icon_emoji: ':robot:',
//   };
//   bot.postMessageToChannel('general', 'Q-Bot at your service!!', params);
// });
