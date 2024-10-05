import { MongoClient } from "mongodb";
import { config } from "dotenv";
config()
async function sortUsers(db, sort, status) {
  const clientdb = new MongoClient(db);
  const dbName = process.env.DB_NAME;
  let dbCollection = "mainstats";
  let count = Number(process.env.MAINSTATS_MATCHES_COUNT); 
  if (status === "temp") { 
    count = Number(process.env.TEMPSTATS_MATCHES_COUNT); 
    dbCollection = "tempstats";
  }

  try {
    await clientdb.connect();
    const db = clientdb.db(dbName);
    const collection = db.collection(dbCollection);
    const result = await collection
      .find({ "matches.matches": { $gte: count } })
      .sort({ [sort]: -1 })
      .limit(20)
      .toArray();
    const players = result.map((player) => {
      const { name, kills, death, revives, teamkills, kd, matches } = player;
      const matchesMatches = matches.matches;
      return `${name.trim()} ${kills} ${death} ${revives} ${teamkills} ${kd} ${matchesMatches}`;
    });
    return players;
  } catch (e) {
    console.error(e);
  } finally {
    await clientdb.close();
  }
}

export default sortUsers;
