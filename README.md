# tie-api-example-discord
This node.js example connector allows you to make your Teneo solution available as a bot on [Discord](https://discordapp.com/). The connector acts as middleware between Discord and Teneo. The bot on your Discord server will respond to direct messages. In addition to that, you can configure it to respond to all messages in a specific channel. 

This guide will take you through the steps needed to make your Teneo bot available on your Discord server.

## Prerequisites
### Discord account
You need to have a discord account to create a Discord bot application. You also need admin access to a Discord server where you can add the bot.

### Teneo Engine
Your teneo bot/solution needs to be published and you need to know the engine url.

## Setup instructions

### Clone the connector
Download or clone the connector source code from [Github](https://github.com/artificialsolutions/tie-api-example-discord).
```
git clone https://github.com/artificialsolutions/tie-api-example-discord.git
```

### Install dependencies
```
npm install
```

### Create a Discord bot application
Follow the instructions here to create a Discord bot application: [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
Make sure 

Make sure you take note and store safely, <mark>client_id</mark> of the new app, and the <mark>token</mark> of its bot. These will needed when you start the connector.

Also, the bot's username, which is formatted 'YourBot#1234' can be used later on to send Direct Messages to this bot.

### Add the bot to your Discord server
Follow the instructions here to add the bot to your server: [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).
This involves opening a Bot inviting link in your browser which is contructed using the 'client_id' of the app that was obtained the previous step:

https://discord.com/oauth2/authorize?client_id=12345&scope=bot

Add the bot to an existing Server and authorize it. Create a Server if needed, by clicking on the '+' shaped Add Server button from the left menu of the Discord Chat.

### Start the connector
Start the connector with the following environment variables:
* **DISCORD_TOKEN:** The <mark>token</mark> you copied when you created the Discord bot application.
* **DISCORD_CHANNEL:** The bot will respond to direct messages only. If you want your bot to respond to *any* message from *any* user in a particular channel, provide the name of that channel here. For example, 'general' is a common channel name that is usually created automatically on every new Discord server.
* **TENEO_ENGINE_URL:** The engine url.

To start the connector (replacing the environment variables with the appropriate values) use the following command:
```
DISCORD_TOKEN=<your_discord_token> DISCORD_CHANNEL=<discord_channel_name> TENEO_ENGINE_URL=<your_engine_url> node server.js
```

That's it! Your bot should now be available on your Discord server and respond to messages that are sent to it.