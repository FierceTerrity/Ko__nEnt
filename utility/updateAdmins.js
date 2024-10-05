import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

async function getAllData(client) {
  const database = client.db("squadjs");
  const collection = database.collection("discordadmins");
  const result = await collection.find({}).toArray();
  return result;
}

async function updateAdmins(interaction) {
  const warnMessageId = process.env.ADMINS_MESSAGEID;
  const db = process.env.DATABASE_URL;
  const mongoClient = new MongoClient(db, {
    useUnifiedTopology: true,
  });

  try {
    await mongoClient.connect();

    const allData = await getAllData(mongoClient);

    const tableRows = allData
      .sort((a, b) => new Date(b.lastseen) - new Date(a.lastseen))
      .map((admin) => {
        const dateObject = new Date(admin.lastseen);
        const formattedDate = `${dateObject
          .getDate()
          .toString()
          .padStart(2, "0")}.${(dateObject.getMonth() + 1)
          .toString()
          .padStart(2, "0")}.${dateObject.getFullYear()} ${dateObject
          .getHours()
          .toString()
          .padStart(2, "0")}:${dateObject
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        return ` ${admin.name}  [${admin.warn}] [${formattedDate}]`;
      })
      .join("\n");

    const channelId = interaction.channelId;
    const channel = await interaction.guild.channels.fetch(channelId);
    const message = await channel.messages.fetch(warnMessageId);

    await message.edit("```" + tableRows + "```");
  } finally {
    await mongoClient.close();
  }
}

export default updateAdmins;
