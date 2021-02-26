const express = require('express');
const app = express();
const cron = require('node-cron');
const port = process.env.port || 8000;
var passport = require('passport');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

// var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
app.use(express.json());
app.use(express.urlencoded());

let userInfo = {};
module.exports = { userInfo };
// app.use(passport.initialize());

// passport.use(
//   new FitbitStrategy(
//     {
//       clientID: process.env.FITBIT_CLIENT_ID,
//       clientSecret: process.env.FITBIT_SECRET,
//       callbackURL: 'http://localhost:8000/auth/fitbit/callback',
//       scope: ['activity', 'heartrate', 'location', 'profile'],
//     }
// function (accessToken, refreshToken, profile, done) {
//   User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
//     // TODO: save accessToken here for later use
//     return done(err, user);
//   });
// }
//   )
// );

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (obj, done) {
//   done(null, obj);
// });

// var fitbitAuthenticate = passport.authenticate('fitbit', {
//   successRedirect: '/auth/fitbit/success',
//   failureRedirect: '/auth/fitbit/failure',
// });

// app.get('/auth/fitbit', fitbitAuthenticate);
// app.get('/auth/fitbit/callback', fitbitAuthenticate);

app.get(`/auth/fitbit/callback`, async (req, res, next) => {
  console.log(req.query.code, 'req.query.code');
  const code = req.query.code;
  console.log(code, 'code');
  const secretString = `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_SECRET}`;
  const data = Buffer.from(secretString).toString('base64');
  let activityResponse;
  const redirectUri = encodeURIComponent(
    `http://localhost:8000/auth/fitbit/callback`
  );
  console.log(redirectUri, 'redirectUri');

  try {
    const response = (
      await axios.post(
        `https://api.fitbit.com/oauth2/token?code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}&clientId=${process.env.FITBIT_CLIENT_ID}`,
        {},
        {
          headers: {
            Authorization: `Basic ${data}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
    ).data;
    console.log(response);
    const { access_token, refresh_token, user_id } = response;
    process.env.FITBIT_ACCESS_TOKEN = access_token;
    process.env.FITBIT_USER_ID = user_id;

    const userResponse = (
      await axios.get(`https://api.fitbit.com/1/user/-/profile.json`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).data;
    console.log(userResponse, 'userResponse');
    userInfo = { ...userInfo, ...userResponse };
    res.send(
      `<html>
        // <head>
        //   <style>
        //   body {text-align: center; color: purple;}
        //   div {padding: 3rem;}
        //   </style>
        // </head>
        <body>
          <div>
            <h1>Hello, ${userResponse.user.displayName} Thanks for authorizing Q-Bot to access FitBit! Head back to slack and see what you can do!
            </h1>
          </div>
        </body>
       </html>`
    );
  } catch (err) {
    console.log(err);
  }
});
console.log(process.env.FITBIT_ACCESS_TOKEN, 'process.env FAT');
// const getActivity = async () => {
//   try {
//     const response = (
//       await axios.get(
//         `https://api.fitbit.com/1/user/-/activities/date/2021-02-25.json
//       `,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.FITBIT_ACCESS_TOKEN}`,
//           },
//         }
//       )
//     ).data;
//     console.log(response, 'response from api');
//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// };

// let activityResponse;
// if (process.env.FITBIT_ACCESS_TOKEN) {
//   console.log('we have a fb at in app.js line 220');
//   getActivity().then((response) => (activityResponse = { ...response }));
// }
// console.log(activityResponse, 'activity response in server.js');
// app.get('/auth/fitbit/success', function (req, res, next) {
//   console.log('fitbit success');
// });
app.listen(port, () => console.log(`listening on port ${port}`));
