const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

require("dotenv").config();

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/includes'));
app.use(express.static(__dirname + '/static'))

app.get('/', (req, res) => {
  res.render('pages/index/index', {
    page: 'home'
  });
});

app.get('/projects', (req, res) => {
  res.render('pages/projects/projects', {
    page: 'projects'
  });
});

app.get('/skills', (req, res) => {
  res.render('pages/skills/skills', {
    page: 'skills'
  });
});

app.get('/aboutme', (req, res) => {
  res.render('pages/aboutme/aboutme', {
    page: 'aboutme'
  });
});

app.get('/contacts', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/pages/contacts/contacts.html'))
});

app.get('/members', (req, res) => {
  res.render('pages/members/members', {
    page: 'members'
  });
});

app.get("/api/repos", (req, res) => {
  axios({
    method: "get",
    url: `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.mercy-preview+json"
    }
  }).then(response => {
    res.send(response.data);
  }).catch(err => {
    res.send(err);
  });
});

const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./attachments");
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const attachmentUpload = multer({
  storage: Storage,
}).single("attachment");

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token : error message(" + err);
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL, accessToken,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  return transporter;
};

app.post("/send_email", (req, res) => {
  attachmentUpload(req, res, async function (error) {
    if (error) {
      return res.send("Error uploading file");
    } else {
      const name = req.body.name;
      const sender = req.body.email-address;
      const mailSubject = req.body.subject;
      const mailBody = req.body.message;
      const attachmentPath = req.file?.path;

      let mailOptions = {
        from: sender,
        to: process.env.EMAIL,
        subject: mailSubject,
        text: name+" "+mailBody,
        attachments: [
          {
            path: attachmentPath,
          },
        ],
      };

      try {
        let emailTransporter = await createTransporter();

        emailTransporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);

            fs.unlink(attachmentPath, function (err) {
              if (err) {
                return res.end(err);
              } else {
                console.log(attachmentPath + " has been deleted");
                return res.sendFile(path.join(__dirname, '/views/pages/contacts/success.html'));
              }
            });
          }
        });
      } catch (error) {
        return console.log(error);
      }
    }
  });
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});