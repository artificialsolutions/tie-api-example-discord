const Discord = require('discord.js');
const client = new Discord.Client();
const TIE = require('@artificialsolutions/tie-api-client');
const express = require('express');

// mandatory environment variables
const discordToken = process.env.DISCORD_TOKEN;
const discordChannel = process.env.DISCORD_CHANNEL || "";
const teneoEngineUrl = process.env.TENEO_ENGINE_URL;


// initialise teneo client
const teneoApi = TIE.init(teneoEngineUrl);

// initialise session handler, to store mapping between discord channel and engine session
const sessionHandler = SessionHandler();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if ((message.channel.name === discordChannel || message.channel.type === "dm") && !message.author.bot) {
        handleMessage(sessionHandler, message);
    }
});

async function handleMessage(sessionHandler, message) {

    try {
        console.log(`Got message '${message.content}' from channel ${message.channel.id}`);

        // find engine session id mapped to channel id
        const sessionId = await sessionHandler.getSession(message.channel.id);

        // send message to engine using sessionId
        const teneoResponse = await teneoApi.sendInput(sessionId, {
            text: message.content
        });

        console.log(`Got Teneo Engine response '${teneoResponse.output.text}' for session ${teneoResponse.sessionId}`);

        // store mapping between channel and engine sessionId
        await sessionHandler.setSession(message.channel.id, teneoResponse.sessionId);

        // get output text from engine
        const answerMessage = teneoResponse.output.text;

        // send message to discord with engine output text
        await sendAnswerMessage(message, answerMessage);

    } catch (error) {
        console.error(`Failed when sending input to Teneo Engine @ ${teneoEngineUrl}`, error);
    }
}

function sendAnswerMessage(message, answerMessage) {
    message.channel.send(answerMessage)
        .catch(console.error);
}

/* *
 * SESSION HANDLER
 * */
function SessionHandler() {

    // Map the channel id to the teneo engine session id. 
    // This code keeps the map in memory, which is ok for testing purposes
    // For production usage it is advised to make use of more resilient storage mechanisms like redis
    const sessionMap = new Map();

    return {
        getSession: (userId) => new Promise((resolve, reject) => {
            if (sessionMap.size > 0) {
                resolve(sessionMap.get(userId));
            }
            else {
                resolve("")
            }
        }),
        setSession: (userId, sessionId) => new Promise((resolve, reject) => {
            sessionMap.set(userId, sessionId);
            resolve();
        })
    };
}

client.login(discordToken);

// strictly speaking we don't need the code below, this is only here to prevent heroku from killing the process 
const expressApp = express();
expressApp.get('/', function(req, res){
    res.send('Connector running');
});
expressApp.listen(process.env.PORT || 3746)