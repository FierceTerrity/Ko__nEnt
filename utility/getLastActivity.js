import { config } from "dotenv";
import { MongoClient } from "mongodb";
import axios from "axios";

config();

const db = process.env.DATABASE_URL;
const client = new MongoClient(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const getLastActivity = async () => {
  try {
    await client.connect();
    const database = client.db(process.env.DB_NAME);
    const collection = database.collection("discordadmins");
    const tokenBM = process.env.BATTLEMETRICS_API_KEY_RCON;
    const serverId = ["28066527", "28299825", "28321026", "28320984"];

    const admins = await collection.find({}).toArray();

    const delayBetweenServers = 1000;
    const delayBetweenAdmins = 10000;

    for (const admin of admins) {
      const existingData = await collection.findOne({ _id: admin._id });
      let latestLastSeen = existingData.lastseen;
      if (existingData.bmuserid) {
        for (const server of serverId) {
          try {
            const searchUrl = `https://api.battlemetrics.com/players/${existingData.bmuserid}/servers/${server}`;
            const response = await axios.get(searchUrl, {
              headers: {
                Authorization: `Bearer ${tokenBM}`,
              },
            });
            //console.log(response)
            if (response.data.errors) {console.log(response.data.errors)}
            const tempLastSeen = response.data.data.attributes.lastSeen;
            const tempLastSeenDate = new Date(tempLastSeen);
            if (!latestLastSeen || tempLastSeenDate > latestLastSeen) {
              latestLastSeen = tempLastSeenDate;
            }

            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenServers)
            );
          } catch (err) {console.log(err)}
        }

        if (latestLastSeen > existingData.lastseen) {
          await collection.updateOne(
            { _id: admin._id },
            {
              $set: { lastseen: latestLastSeen },
            }
          );
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delayBetweenAdmins));
    }
  }
  catch (e) {
    console.log(e)
    
  }
   finally {
    await client.close();
  }
};

export default getLastActivity;
