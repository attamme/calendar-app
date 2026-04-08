const knex = require("knex")(require("../db/knexfile").development);
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")

require("dotenv").config();

async function createEvent(req, res){
    try {
        const [event] = await knex("events").insert({
        title: req.body.title,
        owner_id: req.token.sub,
        calendar_id: req.body.calendar_id,
        description: req.body.description,
        date_start: new Date(),
        date_end: req.body.date_end,
        time_estimate: req.body.time_estimate,
        location: req.body.location,
        priority: req.body.priority,
        repeat: req.body.repeat,
        task: req.body.task,
        color: req.body.color
        });

        const user = await knex("event_users").insert({event_id: event, user_id: req.token.sub});

        res.send("success ?")

    } catch (error) {
        res.send("error ?")
    }
}

async function getMyExperiences(req, res) {
    try {
        const exps = await knex("events")
            .join("event_users", "events.id", "event_users.event_id")
            .where("event_users.user_id", req.token.sub)
            .select("events.*")
            .orderBy("events.date_end", "asc");

        res.json(exps);
    } catch (error) {
        console.error(error);
        res.status(500).json("Something went wrong");
    }
}

async function addUserToExperience(req, res) {
    try {
        const user = await knex("users").select("*").where("username", req.body.username).first();
        await knex("event_users").insert({event_id: req.body.event_id, user_id: user.id});
        res.send("success ?");
    } catch (error) {
        res.send("something went wrong");
    }
}

module.exports = {createEvent, getMyExperiences, addUserToExperience}