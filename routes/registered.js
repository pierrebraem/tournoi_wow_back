const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query('SELECT parties.id, parties.party_name FROM registered INNER JOIN parties ON registered.parties_id = parties.id WHERE registered.tournament_id = $1', [id]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    try{
        await db.query("INSERT INTO registered VALUES ($1, $2, $3)", [id, body.id, "2025-02-11"]);
        res.status(200).send({ "message": "Updated" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

module.exports = router;