const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const app = express();

// Middleware for handling json
app.use(bodyParser.json());

// Passport
const opts = {
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

    if (jwt_payload.username === 'test') {
        // return any value on success
        return done(null, true);
    }

    // return false when auth fails
    return done(null, false);

}));
app.use(passport.initialize());

app.post('/api/login', (req, res) => {

    // Should get user from db
    let user = {
        username: 'test',
        password: '1234'
    };

    let body = null;

    if (req.body.username === user.username) {
        if (req.body.password === user.password) {
            let token = jwt.sign(req.body, opts.secretOrKey);
            body = {
                msg: 'execute login',
                token: token
            };
        }
    }

    if (body) {
        res.json(body);
    }
    else {
        res.sendStatus(401);
    }

});

/**
 * For testing. This is used to simulate a protected endpoint.
 */
app.get('/api/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        ok: 'The request was authenticated',
    });
});

app.get('/api/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        authenticated: true
    });
});

// Application routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

// Static files path
app.use(express.static(__dirname + '/dist'));

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
