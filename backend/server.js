const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const Client = require('ibmiotf');
const Cloudant = require('cloudant');

const app = express();
const port = (process.env.PORT || 3000);

// Middleware for handling json and cors
app.use(bodyParser.json());
app.use(cors());

// Passport
const opts = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

    if (jwt_payload.username === process.env.USERNAME) {
        // return any value on success
        return done(null, true);
    }

    // return false when auth fails
    return done(null, false);

}));
app.use(passport.initialize());

// IBM IoT client
const appClientConfig = {
    "org" : process.env.IBM_ORG_ID,
    "id" : 'myapp',
    "domain": "internetofthings.ibmcloud.com",
    "auth-key" : process.env.IOT_AUTH_KEY,
    "auth-token" : process.env.IOT_AUTH_TOKEN
};
const appClient = new Client.IotfApplication(appClientConfig);
appClient.connect();
appClient.on('error', (err) => {
    console.log(err);
});
appClient.on('connect', () => {
    console.log('Connected to IBM IoT platform');
});

// Cloudant
let db;
const cloudantConfig = {
    account: process.env.CLOUDANT_ACCOUNT,
    username: process.env.CLOUDANT_USERNAME,
    password: process.env.CLOUDANT_PASSWORD
};
Cloudant(cloudantConfig, (err, cloudant) => {
    if (err) throw err;

    db = cloudant.use('nsaimagestore');
    console.log('Connected to IBM Cloudant');
});


app.post('/api/login', (req, res) => {

    let user = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    };

    let body = null;

    if (req.body.username === user.username) {
        if (req.body.password === user.password) {
            let token = jwt.sign(req.body, opts.secretOrKey);
            body = {
                msg: 'Login succesful',
                token: token
            };
        }
    }

    if (body) {
        res.json(body);
    } else {
        res.sendStatus(401);
    }

});

app.get('/api/raspis', passport.authenticate('jwt', { session: false }), (req, res) => {
    appClient.listAllDevicesOfType('raspi')
    .then(
        response => {
            console.log(response);
            res.json(response);
        },
        err => {
            console.log(err);
            res.sendStatus(500);
        }
    )
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    });
});

app.get('/api/documents', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.list((err, body) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.json(body);
        }
    });
});

app.get('/api/documents/:id/image', passport.authenticate('jwt', { session: false }), (req, res) => {
    db.get(req.params.id, (err, body) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            try {
                let imageData = JSON.parse(body.payload).content.data;
                res.json(imageData);
            } catch (err) {
                console.log(err);
                res.sendStatus(500);
            }
        }
    });
});

/**
 * Frontend checks if existing jwt is valid
 */
app.get('/api/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.sendStatus(200);
});

http.createServer(app).listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
