const express = require('express');
require('dotenv').config();
const db = require('./db');

const app = express();
const port = process.env.PORT;

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM roles');
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM roles WHERE id = $1', [id]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port, () => {
    console.log(`App running on ${port}`)
});