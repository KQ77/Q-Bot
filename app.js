const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const { App } = require('@slack/bolt');

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');

// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

const app = new App({
  token: process.env.BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();
// const init = async () => {
//   await app.start(process.env.PORT || 3000);
//   console.log('⚡️ Bolt app started');
//   const response = await axios.post(
//     `https://slack.com/api/apps.connections.open
//     `,
//     {
//       headers: {
//         'Content-type': 'application/json',
//         Authorization: `Bearer ${process.env.SLACK_APP_TOKEN}`,
//       },
//     }
//   ).data;
//   console.log(response, 'response');
// };

// init();

app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Thanks for the mention <@${event.user}>! Here's a button`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Button',
              emoji: true,
            },
            value: 'click_me_123',
            action_id: 'first_button',
          },
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
});

const profjoke = async () => {
  let joke = (
    await axios.get(`http://api.icndb.com/jokes/random?limitTo=[nerdy]
            http://api.icndb.com/jokes/random?limitTo=[nerdy]`)
  ).data.value.joke;
  return joke.replace(/Chuck Norris/g, 'Prof');
};
app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.message('profjoke', async ({ message, say }) => {
  const joke = await profjoke();
  await say(`Here's a Prof Joke For You: ${joke}`);
});
// try {
//   axios.post(process.env.WEBHOOK_URL, JSON.stringify({ text: 'I am Q-Bot' }), {
//     headers: {
//       'Content-type': `application/json`,
//     },
//   });
// } catch (err) {
//   console.log(err);
// }

// const handleMessage = (message) => {
//   console.log(message, 'message');
//   if (message.includes('prof')) {
//     profJoke();
//   }
// };
// var SlackBot = require('slackbots');
// // create a bot
// var bot = new SlackBot({
//   token: process.env.BOT_TOKEN,
//   name: 'Q-Bot',
// });

// bot.on('start', function () {
//   var params = {
//     icon_emoji: ':qbot:',
//   };
//   bot.postMessageToChannel('general', 'Q-Bot at your service!', params);
// });

// bot.on('message', function (data) {
//   // all ingoing events https://api.slack.com/rtm
//   console.log(data, 'data');
// });

// const profJoke = async () => {
//   const response = (
//     await axios.get(`http://api.icndb.com/jokes/random?limitTo=[nerdy]
//     http://api.icndb.com/jokes/random?limitTo=[nerdy]`)
//   ).data;
//   console.log(joke, 'joke');
//   let joke = response.value;
//   const params = {
//     icon_emoji: '::prof:',
//   };
//   joke = joke.replace('Chuck Norris', 'Prof');
//   console.log(joke, 'joke');
//   bot.postMessageToChannel('general', `Prof Norris: ${joke}`, params);
// };

// bot.on('error', (error) => console.log(error));

// app.listen(port, () => console.log(`listening on port ${port}`));
