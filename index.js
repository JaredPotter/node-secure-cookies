// External libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const inMemoryUserStore = {
    'jaredpotter': '<superSecretPassword>',
};

const whitelist = ['http://localhost:*', 'http://127.0.0.1:5501'];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
};

// Enable Express middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000 // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true // if you use the secret with cookieParser
};

app.post('/login', (req, res) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;

    if(inMemoryUserStore[username] === password) {
        // <Generate JWT token>
        const jwt = 'blah.blah.blah';

        res.cookie('token', jwt, cookieConfig);
        res.status(200).send('OK');
    }
    else {
        res.status(400).send('Username/password incorrect');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('OK');
});

app.get('/authenticatedData', (req, res) => {
    const cookies = req.cookies;
    const token = cookies.token;

    // <verify token>

    if(token) {
        // <if valid, return authenticated data>
        res.status(200).send('<authenticated data>');
    }
    else {
        res.status(400).send('Token missing or not valid');
    }
});

app.listen(port, () => {
    console.log(`Server Stated on port ${port}!`);
});
