const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { jokes } = require('./jokes');
const { App } = require('@slack/bolt');
const { convertTime, generateRandomQuote } = require('./utils');
const { devQuotes, inspireQuotes } = require('./quotes');

//import blocks //
const {
  chinBlocks,
  neckBlocks,
  lumbarBlocks,
  postureBlocks,
} = require('./blocks');

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');

// WebClient insantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});
// set up a cron job to schedule something once a day?
//write a condition to schedule a message each day?
//OR how about once you schedule a message...you call a function that
//schedules another message a day later (current time in epoch plus a day which is +however many seconds)
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
      type: [`public_channel`, 'mpim', 'im'],
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

app.command('/inspire', async ({ command, ack, say }) => {
  // Acknowledge command request

  await ack();

  await say(`you've been inspired`);
});

const getMembers = async () => {
  const response = await app.client.conversations.members({
    token: process.env.BOT_TOKEN,
    channel: channelId,
  });
  return response.members;
};

// const getReminders = async () => {
//   const response = await app.client.reminders.list({
//     token: process.env.USER_TOKEN,
//   });
// };

// getReminders();

app.event('app_mention', async ({ event, context, client, say }) => {
  try {
    await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Thanks for the mention <@${event.user}>!`,
          },
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
});

//if it is 4PM, send inspiration **FIX THIs with node-cron
const scheduleInspireTime = async () => {
  try {
    if (new Date().getHours() === 16) {
      console.log('it is 4pm');
      await client.chat.postMessage({
        token: process.env.BOT_TOKEN,
        channel: channelId,
        icon_emoji: ':qbot:',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Get ready to get inspired!',
            },
            accessory: {
              type: 'image',
              image_url:
                'https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg',
              alt_text: 'cute cat',
            },
          },
        ],
      });
    }
  } catch (err) {
    console.log(err);
  }
};
scheduleInspireTime();

//profjoke
const profjoke = async () => {
  let joke = jokes[Math.floor(Math.random() * jokes.length)];
  return joke;
};

app.message('profjoke', async ({ ack, message, say }) => {
  const joke = await profjoke();

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Prof Norris Joke*  :martial_arts_uniform: ${joke} :martial_arts_uniform:`,
      },
    },
  ];
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.BOT_TOKEN,
      channel: channelId,
      blocks,
      icon_emoji: ':prof:',

      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
  } catch (error) {
    console.error(error);
  }
});

//waving emoji
app.message(':wave:', async ({ message, say }) => {
  await say(`Hello, <@${message.user}>`);
});

app.message('fitbot', async ({ message, say }) => {
  await say(
    `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22C43Z&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Ffitbit%2Fcallback&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800`
  );
});

const getActivity = async () => {
  try {
    const response = (
      await axios.get(
        `https://api.fitbit.com/1/user/-/activities/date/2021-02-25.json
    `,
        {
          headers: {
            Authorization: `Bearer ${process.env.FITBIT_ACCESS_TOKEN}`,
          },
        }
      )
    ).data;
    console.log(response, 'response from api');
    return response;
  } catch (err) {
    console.log(err);
  }
};

// console.log(userInfo, 'userInfo');
// let activityResponse;
// if (process.env.FITBIT_ACCESS_TOKEN) {
//   console.log('we have a fb at in app.js line 220');
//   getActivity().then((response) => (activityResponse = { ...response }));
// }
app.message('activity', async ({ message, say }) => {
  await say(
    `Here are your average daily steps: ${userInfo.user.averageDailySteps}`
  );
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
// publishMoveReminder('timepicker-neckstretch');

async function publishMessage(id, blocks, icon_emoji) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.BOT_TOKEN,
      channel: id,
      blocks,
      icon_emoji,
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

//scheduled tasks
const cron = require('node-cron');

// minutes hours dayOfMonth month dayOfWeek

// chin tuck exercise reminder - every hour on the 15 minute mark
cron.schedule('15 * * * *', async function () {
  await app.client.chat.postMessage({
    token: process.env.BOT_TOKEN,
    channel: channelId,
    blocks: chinBlocks,
  });
});

// neck extension exercise prompt every hour on the dot
cron.schedule('0 * * * *', async function () {
  await app.client.chat.postMessage({
    token: process.env.BOT_TOKEN,
    channel: channelId,
    blocks: neckBlocks,
  });
});

//lumbar extension exercise promt - every hour on the half hour
cron.schedule('30 * * * *', async function () {
  await app.client.chat.postMessage({
    token: process.env.BOT_TOKEN,
    channel: channelId,
    blocks: lumbarBlocks,
  });
});

// developer quote - every day at 12pm
cron.schedule('0 12 * * *', async function () {
  await app.client.chat.postMessage({
    token: process.env.BOT_TOKEN,
    channel: channelId,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':nerd_face: Your Daily (aspiring) Developer Quote',
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        accessory: {
          type: 'image',
          image_url: 'https://dzone.com/storage/temp/12334613-971.jpg',
          alt_text: 'laptop',
        },
        text: {
          type: 'mrkdwn',
          text: `${generateRandomQuote(
            devQuotes
          )}\n \nEnjoying these quotes? \nSimply use the command */devquote* to get another! :nerd_face:`,
        },
      },
    ],

    icon_emoji: ':computer:',
  });
});

//inspirational quote - every day at 3pm
cron.schedule(' 0 15 * * *', async function () {
  await app.client.chat.postMessage({
    token: process.env.BOT_TOKEN,
    channel: channelId,

    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':sunny: Daily Inspiration :sunny: ',
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        accessory: {
          type: 'image',
          image_url:
            'https://d2zp5xs5cp8zlg.cloudfront.net/image-10028-340.jpg',
          alt_text: 'sky',
        },
        text: {
          type: 'mrkdwn',
          text: `${generateRandomQuote(
            inspireQuotes
          )} \n\n\nEnjoying these quotes? \nSimply use the command */inspire* to get another! :sunny:`,
        },
      },
    ],
  });
});
