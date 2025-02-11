const checkTournamentsInput = (req, res, next) => {
    const body = req.body;

    if(body.name == undefined){
        res.status(400).send({ "message": "The field 'name' is required" });
        return;
    }

    if(body.start_date == undefined){
        res.status(400).send({ "message": "The field 'start_date' is required" });
        return;
    }

    if(body.end_date == undefined){
        res.status(400).send({ "message": "The field 'end_date' is required" });
        return;
    }

    if(body.participation_right == undefined){
        res.status(400).send({ "message": "The field 'participation_right' is required" });
        return;
    }

    if(body.description == undefined){
        res.status(400).send({ "message": "The field 'description' is required" });
        return;
    }

    if(body.dungeons.length < 1){
        res.status(400).send({ "message": "At least one dungeon must be registered" });
    }

    if(body.parties.length < 2){
        res.status(400).send({ "message": "At least 2 parties must be registered"});
    }

    next();
}

module.exports = checkTournamentsInput;