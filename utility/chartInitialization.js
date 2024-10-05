import createChart from "./chartTickRate.js";
import { config } from "dotenv";
config()
async function chartInitialization(tickRateChannelId) {
  const statsConfig = [
    {
      serverId: "1",
      messageId: process.env.TICKRATE_SERVER_1_MSGID,
      seconds: 1000,
    },
    {
      serverId: "2",
      messageId: process.env.TICKRATE_SERVER_2_MSGID,
      seconds: 4000,
    },
    {
      serverId: "3",
      messageId: process.env.TICKRATE_SERVER_3_MSGID,
      seconds: 7000,
    },
    {
      serverId: "4",
      messageId: process.env.TICKRATE_SERVER_4_MSGID,
      seconds: 10000,
    },
  ];

  const getChart = statsConfig.map((config) =>
    createChart({
      channel: tickRateChannelId,
      serverId: config.serverId,
      messageId: config.messageId,
      seconds: config.seconds,
    })
  );
}

export default chartInitialization;
