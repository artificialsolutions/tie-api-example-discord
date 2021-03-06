/**
 * Copyright 2019 Artificial Solutions. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Discord = require('discord.js');
const client = new Discord.Client();
const TIE = require('@artificialsolutions/tie-api-client');

// mandatory environment variables
const discordToken = process.env.DISCORD_TOKEN;
const discordChannel = process.env.DISCORD_CHANNEL || "";
const teneoEngineUrl = process.env.TENEO_ENGINE_URL;

// initialise teneo client
const teneoApi = TIE.init(teneoEngineUrl);

// initialise session handler, to store mapping between discord channel and engine session
const sessionHandler = SessionHandler();

client.once('ready', () => {
    console.log('Once Ready!');
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// receive message form discord
client.on('message', message => {
    // only respond to direct message, messages from a particular channel and don't let the bot respond to itself
    if ((message.channel.name === discordChannel || message.channel.type === "dm") && !message.author.bot) {
        handleMessage(sessionHandler, message);
    }
});

// process the message from the user
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
client