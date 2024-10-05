import { Client, GatewayIntentBits, Events } from "discord.js";
import getCommands from "./commands/getCommands.js";
import { config } from "dotenv";
config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
  try {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = await getCommands();
    for (let command of commands) {
      command = command.data.toJSON();
      console.log(command)
      await client.guilds.cache
        .get(process.env.GUILD_ID)
        .commands.create(command);
        //console.log(await client.guilds.cache.get(process.env.GUILD_ID).commands)
    }
    await client.destroy();
  } catch (e) {
    console.log(e)
  }
});

client.login(process.env.CLIENT_TOKEN);
