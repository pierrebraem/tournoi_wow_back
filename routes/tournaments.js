const express = require('express');
const router = express.Router();
const checkTournamentsInput = require("../middlewares/checkTournamentsInput");
const db = require('../db');

// Route pour avoir tous les tournois
router.get('/', async (req, res) => {
    const body = req.body;

    try{
        const result = await db.query("SELECT * FROM tournament");
        res.json(result.rows);
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
});

// Route pour ajouter un tournoi
router.post('/', checkTournamentsInput, async (req, res) => {
    const body = req.body;

    try{
        const result = await db.query("INSERT INTO tournament (name, start_date, end_date, participation_right, description) VALUES ($1, $2, $3, $4, $5) RETURNING id", [body.name, body.start_date, body.end_date, body.participation_right, body.description]);
        
        const id = result.rows[0].id;

        for(const dungeon of body.dungeons){
            for(const party of body.parties){
                await db.query("INSERT INTO challenge VALUES ($1, $2, $3)", [dungeon.id, id, party.id]);
                await db.query('INSERT INTO registered VALUES ($1, $2, $3)', [id, party.id, "2025-02-11"]);
            }
        }
        res.status(201).send({ "message": "Created" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Inernal Server Error" });
    }
});

// Route pour supprimer un tournoi
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try{
        await db.query("DELETE FROM challenge WHERE tournament_id = $1", [id]);
        await db.query("DELETE FROM registered WHERE tournament_id = $1", [id]);
        await db.query("DELETE FROM tournament WHERE id = $1", [id]);
        res.status(200).send({ "message": "Deleted" });
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "message": "Internal Server Error" });
    }
})

module.exports = router;
