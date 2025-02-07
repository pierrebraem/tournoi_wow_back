const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

const charactersRouter = require('./routes/characters');

app.use('/characters', charactersRouter);

app.listen(port, () => {
    console.log(`App running on ${port}`);
});