const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');

const app = express();
const port = (process.env.PORT || 3000);

// Middleware for handling json and cors
app.use(bodyParser.json());
app.use(cors());

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

    // Should get user from db or env
    let user = {
        username: 'test',
        password: '1234'
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

/**
 * For testing. This is used to simulate a protected endpoint.
 */
app.get('/api/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        ok: 'This is data that requires authentication',
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
