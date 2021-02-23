const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { jokes } = require('./jokes');
const { App } = require('@slack/bolt');

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');

// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

const channelId = 'C01NN4M0PGE';

const app = new App({
  token: process.env.BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app started');
})();

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.BOT_TOKEN,
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log('Found conversation ID: ' + conversationId);
        // Break from for loop
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Find conversation with a specified channel `name`
findConversation('general');

app.event('app_mention', async ({ event, context, client, say }) => {
  console.log(client, 'client');
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
  let joke = jokes[Math.floor(Math.random() * jokes.length)];
  return joke;
};
app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.message('profjoke', async ({ message, say }) => {
  const joke = await profjoke();
  publishMessage(channelId, `** Prof Norris Joke: ${joke} **`, `:prof:`);
  //  await say(`:prof: Prof Norris Joke: ${joke} :prof:`);
});

async function publishMessage(id, text, icon_emoji) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.BOT_TOKEN,
      channel: id,
      text,
      icon_emoji,

      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// publishMessage(channelId, 'Hello world :tada:');

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
