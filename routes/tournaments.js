const express = require('express');
const router = express.Router();
const checkTournamentsInput = require("../middlewares/checkTournamentsInput");
const db = require('../db');

// Route pour ajouter un tournoi
router.post('/', checkTournamentsInput, async (req, res) => {
    const body = req.body;

    try{
        const result = await db.query("INSERT INTO tournament (name, start_date, end_date, participation_right, description) VALUES ($1, $2, $3, $4, $5) RETURNING id", [body.name, body.start_date, body.end_date, body.participation_right, body.description]);
        
        const id = result.rows[0].id;

        for(const dungeon of body.dungeons){
            console.log(dungeon);
            await db.query("INSERT INTO challenge VALUES ($1, $2)", [dungeon.id, id]);
        }

        for(const party of body.parties){
            const date = new Date();
            await db.query('INSERT INTO registered VALUES ($1, $2, $3)', [id, party.id, "2025-02-11"]);
        }
        res.status(201).send({ "message": "Created" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Inernal Server Error" });
    }
});

module.exports = router;
