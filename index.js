// External libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const fs = require('fs');

const serverOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const inMemoryUserStoreDatabase = {
    jaredpotter: '<superSecretPassword>'
};

const whitelist = [
    'https://localhost:8080'
];

const corsOptions = {
    origin: (origin, callback) => {
        console.log('Request from origin: ' + origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
};

const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true, // if you use the secret with cookieParser
    // domain: '', // 
    // path: '', // 
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//          WEB SERVER
const webApp = express();
const webServerPort = 8080;
webApp.use(express.static('public'));
https.createServer(serverOptions, webApp).listen(webServerPort, () => {
    console.log(`HTTPS Web Server Stated on port ${webServerPort}!`);
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


const httpsApp = express();
const httpsServerPort = 3000;

// Enable Express middlewares
httpsApp.use(cors(corsOptions));
httpsApp.use(bodyParser.json());
httpsApp.use(cookieParser());

// HTTPS SERVER
const httpsServer = https.createServer(serverOptions, httpsApp)
httpsServer.listen(httpsServerPort, () => {
    console.log(`HTTPS Server Stated on port ${httpsServerPort}!`);
});

httpsApp.post('/login', (req, res) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;

    if (inMemoryUserStoreDatabase[username] === password) {
        // <Generate JWT token>
        const jwt = 'blah.blah.blah';

        res.cookie('token', jwt, cookieConfig);
        res.status(200).send('OK');
    } else {
        res.status(400).send('Username/password incorrect');
    }
});

httpsApp.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('OK');
});

httpsApp.get('/authenticatedData', (req, res) => {
    const cookies = req.cookies;
    const token = cookies.token;

    // <verify token>

    if (token) {
        // <if valid, return authenticated data>
        res.status(200).send('<authenticated data>');
    } else {
        res.status(400).send('Token missing or not valid');
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Redirect all HTTP to HTTPS
const httpApp = express();
httpApp.all('*', (req, res) => {
    console.log('Redircting HTTP to HTTPS');
    res.redirect(`https://localhost:${webServerPort}`);
});

const httpServer = http.createServer(httpApp);
httpServer.listen(80, () =>
    console.log(`HTTP Redirect server listening: http://localhost`)
);



