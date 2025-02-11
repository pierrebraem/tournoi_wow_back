const express = require("express");
const router = express.Router();
const db = require('../db');

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const result = await db.query("SELECT challenge.dungeon_id, challenge.party_id, challenge.tournament_id, dungeon.name, parties.party_name, challenge.done FROM challenge INNER JOIN parties ON challenge.party_id = parties.id INNER JOIN dungeon ON challenge.dungeon_id = dungeon.id WHERE challenge.tournament_id = $1", [id]);
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Inernal Server Error" });
    }
});

router.put('/', async (req, res) => {
    const body = req.body;

    try{
        await db.query("UPDATE challenge SET done = true WHERE challenge_id = $1 AND dungeon_id = $2 AND party_id = $3", [body.challenge_id, body.dungeon_id, body.party_id]);
        res.status(200).send({ "message": "Updated" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Inernal Server Error" });
    }
});

module.exports = router;