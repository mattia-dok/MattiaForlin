const express = require('express');

const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const axios = require('axios');

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
  res.render('pages/contacts/contacts', {
    page: 'contacts'
  });
});

app.get('/members', (req, res) => {
  res.render('pages/members/members', {
    page: 'members'
  });
});

app.get("/api/repos", (req, res) => {
  axios({
    method: "get",
    url: `https://api.github.com/users/${config.githubUsername}/repos`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.mercy-preview+json"
    }
  }).then(response => {
    res.send(response.data);
  }).catch(err => {
    res.send(err);
  });
});

app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});