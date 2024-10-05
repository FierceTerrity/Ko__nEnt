import leaderboard from "./leaderboard.js";
import {config} from 'dotenv'
config()

async function top20StatsMain(leaderboardChannelId, db) {
  const statsConfig = [
    {
      sort: "kills",
      messageId: process.env.MAINSTATS_KILLS_ID,
      authorName: "Топ 20 игроков по убийствам",
      seconds: 3000,
      status: "main",
    },
    {
      sort: "death",
      messageId: process.env.MAINSTATS_DEATH_ID,
      authorName: "Топ 20 игроков по смертям",
      seconds: 7000,
      status: "main",
    },
    {
      sort: "revives",
      messageId: process.env.MAINSTATS_REVIVES_ID,
      authorName: "Топ 20 медиков",
      seconds: 11000,
      status: "main",
    },
    {
      sort: "teamkills",
      messageId: process.env.MAINSTATS_TEAMKILLS_ID,
      authorName: "Топ 20 тимкилеров",
      seconds: 15000,
      status: "main",
    },
    {
      sort: "kd",
      messageId:  process.env.MAINSTATS_KD_ID,
      authorName: "Топ 20 игроков по соотношению убийств к смертям",
      seconds: 20000,
      status: "main",
    },
  ];

  const getStats = statsConfig.map((config) =>
    leaderboard({
      channel: leaderboardChannelId,
      db,
      sort: config.sort,
      messageId: config.messageId,
      authorName: config.authorName,
      seconds: config.seconds,
      status: config.status,
    })
  );
}

export default top20StatsMain;
