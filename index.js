// External libraries
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
};

// Enable Express middlewares
app.use(cors(corsOptions));
app.use(cookieParser());

const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000 // ttl in ms (remove this option and cookie will die when browser is closed)
    // signed: true // if you use the secret with cookieParser
};

app.post('/login', (req, res) => {
    res.cookie('token', '<JWT TOKEN VALUE>', cookieConfig);

    res.status(200).send('OK');
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
