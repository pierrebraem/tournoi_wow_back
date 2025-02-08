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
const classRouter = require('./routes/class');
const canbeRouter = require('./routes/canbe');

app.use('/characters', charactersRouter);
app.use('/class', classRouter);
app.use('/canbe', canbeRouter);

app.listen(port, () => {
    console.log(`App running on ${port}`);
});