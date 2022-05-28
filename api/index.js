const app = require("express")();
const { Client } = require("discord.js");
const client = new Client({
    intents: 32767
});
const axios = require("axios");

const settings = require("./settings.json");

client.login(settings.botToken);
client.on("ready", () => console.log("Ready"));

app.get("/userData",async (req,res) => {
    let user = client.guilds.cache.get(settings.guildId).members.cache.get(settings.userId);
    let avatar = user.displayAvatarURL();
    let status = user.presence.status;

    res.send({
        avatar,
        status,
        userId: settings.userId
    });
});

app.get("/repoData",async (req,res) => {
    let repos = await axios.get(`https://api.github.com/users/${settings.githubName}/repos`);
    repos = repos.data;
    repos = repos.sort((a,b) => b.stargazers_count - a.stargazers_count);
    repos = repos.map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        desc: r.description
    }));

    res.send({
        repos,
        githubName: settings.githubName
    });
});

app.get("/textData",async (req,res) => {
    let text = settings.text;

    res.send({
        text
    });
});

app.get("/projectsData",async (req,res) => {
    let projects = settings.projects;

    res.send({
        projects
    });
});

module.exports = {
    path: "/api/",
    handler: app
};