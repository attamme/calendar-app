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
        const cals = await knex("calendars").select("*");
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
        

        const calendars = {}
        cal_users.forEach(async (x, i) => {
            const cal = await knex("calendars").where("id", x.calendar_id)
            calendars.push(cal);
        });


        res.json(calendars)
    } catch (error) {
        console.log(error)
        res.send("Something went wrong.")
    }
}

async function addFriend(req, res, extra){
    try{
        
        if (extra){
            await knex("calendar_users").insert({adder_id: extra.id, user_id: extra.id, calendar_id: extra.calendar_id})
        } else {
            const adder = await knex("users").where("id", req.token.sub).first();
            const user = await knex("users").where("username", req.body.username).first();
            await knex("calendar_users").insert({adder_id: adder.id, user_id: user.id, calendar_id: req.body.calendar_id});
        }
        res.send("successful! added friend to calendar");
    }catch(err){
        
        console.log(err);

        res.status(401).send(req.token);
    } 
}

async function create(req, res){
    try{
        const owner = await knex("users").where("id", req.token.sub).first();
        const created = await knex("calendars").insert({title: req.body.title, owner_id: owner.id, color: req.body.color});
        addFriend({extra: {id: owner.id, calendar_id: created.id}})
        res.send("successful! calendar added");
    }catch(err){
        
        console.log(err);

        res.status(401).send("something went wrong creating a new calendar");
    } 
}

module.exports = {getAll, addFriend, create, getFriends, showMyCalendars} 