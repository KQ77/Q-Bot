const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { jokes } = require('./jokes');
const { App } = require('@slack/bolt');
const { convertTime } = require('./utils');
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

// The echo command simply echoes on command
app.command('/inspire', async ({ command, ack, say }) => {
  // Acknowledge command request

  await ack();

  await say(`you've been inspired`);
});
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

//profjoke
const profjoke = async () => {
  let joke = jokes[Math.floor(Math.random() * jokes.length)];
  return joke;
};
app.message('profjoke', async ({ message, say }) => {
  const joke = await profjoke();
  publishMessage(channelId, `*Prof Norris Joke*: ${joke}`, `:prof:`);
});

//waving emoji
app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

//listen for if time selected in timepicker
app.action('timepicker-neckstretch', async ({ client, say, payload, ack }) => {
  await ack();
  console.log(payload, 'payload');
  try {
    // Call the chat.scheduleMessage method using the WebClient
    const result = await client.chat.scheduleMessage({
      channel: channelId,
      icon_emoji: ':qbot:',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '*ACTIVITY REMINDER* \n Neck Extensions\n <https://youtu.be/ZY3s2Y1dTck|click here for instructions>',
          },
        },
        {
          type: 'image',
          image_url:
            'https://acewebcontent.azureedge.net/exercise-library/large/204-4.jpg',
          alt_text: 'neck stretch',
        },
      ],
      // Time to post message, in Unix Epoch timestamp format
      post_at: convertTime(payload.selected_time),
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

// async function chooseTimeForReminder(action_id) {
//   await app.client.chat.postMessage({
//     token: process.env.BOT_TOKEN,
//     channel: channelId,
//     blocks: [
//       {
//         type: 'section',
//         text: {
//           type: 'mrkdwn',
//           text: 'Choose a time to reschedule reminder',
//         },
//         accessory: {
//           type: 'timepicker',
//           initial_time: '12:00',
//           placeholder: {
//             type: 'plain_text',
//             text: 'Select time',
//             emoji: true,
//           },
//           action_id: `${action_id}`,
//         },
//       },
//     ],
//   });
// }

// chooseTimeForReminder('timepicker-neckstretch');

async function publishMoveReminder(action_id) {
  try {
    await app.client.chat.postMessage({
      token: process.env.BOT_TOKEN,
      channel: channelId,
      icon_emoji: ':qbot:',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '*ACTIVITY REMINDER* \n Neck Extensions\n <https://youtu.be/ZY3s2Y1dTck|click here for instructions>',
          },
        },
        {
          type: 'image',
          image_url:
            'https://acewebcontent.azureedge.net/exercise-library/large/204-4.jpg',
          alt_text: 'neck stretch',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Not a good time? Choose a time to reschedule reminder...',
          },
          accessory: {
            type: 'timepicker',
            initial_time: '12:00',
            placeholder: {
              type: 'plain_text',
              text: 'Select time',
              emoji: true,
            },
            action_id: `${action_id}`,
          },
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
}
publishMoveReminder('timepicker-neckstretch');
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
