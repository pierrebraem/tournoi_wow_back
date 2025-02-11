const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}))

const charactersRouter = require('./routes/characters');
const partiesRouter = require('./routes/parties');
const tournamentsRouter = require('./routes/tournaments');
const classRouter = require('./routes/class');
const canbeRouter = require('./routes/canbe');
const composeRouter = require('./routes/compose');
const dungeonRouter = require('./routes/dungeos');
const registeredRouter = require('./routes/registered');
const challengeRouter = require('./routes/challenge');

app.use('/characters', charactersRouter);
app.use('/parties', partiesRouter);
app.use('/tournaments', tournamentsRouter);
app.use('/class', classRouter);
app.use('/canbe', canbeRouter);
app.use('/compose', composeRouter);
app.use('/dungeos', dungeonRouter);
app.use('/registered', registeredRouter);
app.use('/challenge', challengeRouter);

app.listen(port, () => {
    console.log(`App running on ${port}`);
});