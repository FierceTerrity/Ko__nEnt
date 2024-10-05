import leaderboard from "./leaderboard.js";
import { config } from "dotenv";
config()
async function top20StatsTemp(channelId, db) {
  const statsConfig = [
    {
      sort: "kills",
      messageId: process.env.TEMPSTATS_KILLS_ID,
      authorName: "Топ 20 игроков по убийствам",
      seconds: 1000,
      status: "temp",
    },
    {
      sort: "death",
      messageId: process.env.TEMPSTATS_DEATH_ID,
      authorName: "Топ 20 игроков по смертям",
      seconds: 5000,
      status: "temp",
    },
    {
      sort: "revives",
      messageId: process.env.TEMPSTATS_REVIVES_ID,
      authorName: "Топ 20 медиков",
      seconds: 9000,
      status: "temp",
    },
    {
      sort: "teamkills",
      messageId: process.env.TEMPSTATS_TEAMKILLS_ID,
      authorName: "Топ 20 тимкилеров",
      seconds: 13000,
      status: "temp",
    },
    {
      sort: "kd",
      messageId: process.env.TEMPSTATS_KD_ID,
      authorName: "Топ 20 игроков по соотношению убийств к смертям",
      seconds: 17000,
      status: "temp",
    },
  ];

  const getStats = statsConfig.map((config) =>
    leaderboard({
      channel: channelId,
      db,
      sort: config.sort,
      messageId: config.messageId,
      authorName: config.authorName,
      seconds: config.seconds,
      status: config.status,
    })
  );
}

export default top20StatsTemp;
