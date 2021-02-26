const { devQuotes, inspireQuotes } = require('./quotes');
const { generateRandomQuote } = require('./utils');
const chinBlocks = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':qbot:Move Bot:qbot:',
      emoji: true,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        ' *CHIN TUCKS* \n :qbot: *Perform 20 chin tucks before resuming your work* :qbot:\n - remember to move your head parallel to the floor and to avoid looking down\n - hold for 5-10 seconds and repeat 10 times  ',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        '*Need a refresher?* <https://youtu.be/7rnlAVhAK-8|Click here for a video explanation>',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'image',
    title: {
      type: 'plain_text',
      text: 'Proper Chin Tuck',
      emoji: true,
    },
    image_url:
      'https://mechanicsvillechiropractor.com/wp-content/uploads/2017/09/Chin-Tuck-Office.jpg',
    alt_text: 'chintuck',
  },
];

const neckBlocks = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':qbot:Move Bot:qbot:',
      emoji: true,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        ' *NECK EXTENSIONS* \n :qbot: *Perform 15 neck extensions before resuming your work* :qbot:\n - start with a chin tuck\n- avoid the point of discomfort\n- repeat 15 times  ',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        '*Need a refresher?* <https://youtu.be/RHLz_FA2-FI|Click here for a video explanation>',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'image',
    title: {
      type: 'plain_text',
      text: 'Cervical Extension',
      emoji: true,
    },
    image_url:
      'https://www.therapeuticassociates.com/wp-content/uploads/2018/07/Cylcing_SeatedThoracic-600x300.jpg',
    alt_text: 'neck-extension',
  },
];

const lumbarBlocks = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':qbot:Move Bot:qbot:',
      emoji: true,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        ' *LUMBAR EXTENSIONS* \n *:qbot: Perform 10 lumbar extensions before resuming your work* :qbot:\n',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        '*Need a refresher?* <https://youtu.be/BeVqpwxfAdY|Click here for a video explanation>',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'image',
    title: {
      type: 'plain_text',
      text: 'Lumbar Extension',
      emoji: true,
    },
    image_url:
      'https://i.pinimg.com/474x/c1/61/f6/c161f677905c70e05864b8002b3beddc.jpg',
    alt_text: 'lumbar-extension',
  },
];

const postureBlocks = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':rotating_light: Posture Check :rotating_light: ',
      emoji: true,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        '*Check yourself before you wreck yourself!*\n\nUse this reference to make any necessary adjustments to your posture. \n:qbot:And remember - Q-Bot cares! :qbot:\n',
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        'Want to access this ergonomics guide at any time? Simply type */posture*  ',
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'image',
    image_url:
      'https://i0.wp.com/bluearbor.com/wp-content/uploads/2018/02/Ergonomic-Basics.png',
    alt_text: 'ergonomic work station',
  },
];

//make /posture
//make /inspire
//make /devquote
//make /help
//make /exercise?? - list all exercises in one spot?
//reminders/tips
//move bot walk reminder
// render one piece of info regarding fitbit user

module.exports = { chinBlocks, neckBlocks, lumbarBlocks, postureBlocks };
