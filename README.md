# tie-api-example-discord
This node.js example connector allows you to make your Teneo solution available as a bot on Discord. The connector acts as middleware between Discord and Teneo. This guide will take you through the steps of creating a new Dicord bot and deploying the connector to respond to messages from Discord users.

## Prerequisites
### Discord account server
You need to have a discord account to create a Discord Bot application. You also need admin access to a Discord server where you can add the bot.

### Teneo Engine
Your teneo bot/solution needs to be published and you need to know the engine url.

## Setup instructions
### Create a Discord bot application
Follow the instructions here to create a Discord bot application: [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)

!!!! Remember the `token`, you will need it when you start the connector.

### Add the bot to your server
Follow the instructions here to add the bot to your server: [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

### Deploy the connector
Click the button below to deploy the connector to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg?classes=noborder)](https://heroku.com/deploy?template=https://github.com/artificialsolutions/tie-api-example-discord)

In the 'Config Vars' section, add the following:
* **DISCORD_TOKEN:** The `token` you copied when you created the Discord bot server
* **DISCORD_CHANNEL:** The bot will respond to direct messages only. If you want your bot to respond to *any* message from *any* user in particular channel, provide the name of that channel here.
* **TENEO_ENGINE_URL:** The engine url

If you prefer to run your bot locally, see [Running the connector locally](#running-the-connector-locally).

That's it! Your bot should now be available in Discord and respond to messages that are sent to it.


## Running the connector locally
If you prefer to manually install this connector or run it locally, proceed as follows:
1. Download or clone the connector source code from [Github](https://github.com/artificialsolutions/tie-api-example-discord).
2. Install dependencies by running `npm install` in the folder where you stored the source.
3. Start the connector with the following command (replacing the environment variables with the appropriate values):
    ```
    DISCORD_TOKEN=<your_discord_token> DISCORD_CHANNEL=<discord_channel_name> TENEO_ENGINE_URL=<your_engine_url> node server.js
    ```