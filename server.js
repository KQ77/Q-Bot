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
    const userResponse = (
      await axios.get(`https://api.fitbit.com/1/user/-/profile.json`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).data;
    console.log(userResponse, 'userResponse');
    res.send(
      `<html><body><div><h1>Hello, ${userResponse.user.displayName} Thanks for authorizing Q-Bot to access FitBit! Head back to slack and see what you can do!</h2></div></body></html>`
    );
  } catch (err) {
    // console.log(err);
    console.log(err.response.data.errors, 'response data errors');
  }
});

app.get('/auth/fitbit/success', function (req, res, next) {
  console.log('fitbit success');
});
app.listen(port, () => console.log(`listening on port ${port}`));
