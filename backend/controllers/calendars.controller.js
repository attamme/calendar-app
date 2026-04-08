const knex = require("knex")(require("../db/knexfile").development);
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken")

require("dotenv").config();

async function getAll(req, res){
    try{
        const cals = await knex("calendars").select("*");
        res.json(cals);
    }catch(err){
        console.log(err);
        res.status(401).send("something went wrong...");
    } 
}

async function getFriends(req, res){
    try{
        const cals = await knex("calendar_users").select("*");
        res.json(cals);
    }catch(err){
        console.log(err);
        res.status(401).send("something went wrong...");
    } 
}

async function showMyCalendars(req, res){
    try {
        const user = await knex("users").where("id", req.token.sub).first();
        const cal_users = await knex("calendar_users").where("user_id", user.id);
        

        const calendars = await Promise.all( cal_users.map(async (x, i) => {
            console.log(i)
            return await knex("calendars").where("id", x.calendar_id).first();
        }));


        res.json(calendars)
    } catch (error) {
        console.log(error)
        res.send("Something went wrong.")
    }
}

async function addFriend(req, res){
    try{
            const adder = await knex("users").where("id", req.token.sub).first();
            const user = await knex("users").where("username", req.body.username).first();
            await knex("calendar_users").insert({adder_id: adder.id, user_id: user.id, calendar_id: req.body.calendar_id});
        res.send("successful! added friend to calendar");
    }catch(err){
        
        console.log(err);

        res.status(401).send(req.token);
    } 
}

async function create(req, res){
    try{
        const owner = await knex("users").where("id", req.token.sub).first();
        const [created] = await knex("calendars").insert({title: req.body.title, owner_id: owner.id, color: req.body.color});
        await knex("calendar_users").insert({adder_id: owner.id, user_id: owner.id, calendar_id: created});
        res.send("successful! calendar added");
    }catch(err){
        
        console.log(err);

        res.status(401).send("something went wrong creating a new calendar");
    }
}

async function getEventsFromCalendar(req, res) {
    try {
        const connection = await knex("calendar_users")
            .where("user_id", req.token.sub)
            .andWhere("calendar_id", req.body.calendar_id)
            .first();

        if (!connection) {
            return res.status(403).json("You do not have access to this calendar");
        }

        const events = await knex("events")
            .select("*")
            .where("calendar_id", connection.calendar_id);
            
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("something went wrong getting info");
    }
}

module.exports = {getAll, addFriend, create, getFriends, showMyCalendars, getEventsFromCalendar} 