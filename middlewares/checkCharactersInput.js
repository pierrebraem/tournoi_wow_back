const checkCharactersInput = (req, res, next) => {
    const body = req.body;

    if(body.name == undefined){
        res.status(400).send({ "message": "The field 'name' is required" });
        return;
    }

    if(body.class_id == undefined){
        res.status(400).send({ "message": "The field 'class_id' is required" });
        return;
    }

    if(body.role_id == undefined){
        res.status(400).send({ "message": "The field 'role_id' is required" });
        return;
    }

    if(body.ilvl == undefined){
        res.status(400).send({ "message": "The filed 'ilvl' is required" });
        return;
    }

    if(body.rio == undefined){
        res.status(400).send({ "message": "The field 'rio' is required" });
        return;
    }

    if(body.ilvl < 0 || body.ilvl > 645){
        res.status(400).send({ "message": "The field 'ilvl' must be between 0 and 645" });
        return;
    }

    if(body.rio < 0 || body.rio > 4500){
        res.status(400).send({ "message": "The field 'rio' must be between 0 and 4500" });
        return;
    }

    next();
}

module.exports = checkCharactersInput;