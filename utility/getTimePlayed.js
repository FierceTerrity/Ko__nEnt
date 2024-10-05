import { config } from "dotenv";
import axios from "axios";

config();

const apiURL_BM = "https://api.battlemetrics.com/players/match";
const serverId = ["28066527", "28299825", "28321026", "28320984"];
const tokenBM = process.env.BATTLEMETRICS_API_KEY_RCON;
const headers = {
  headers: {
    Authorization: `Bearer ${tokenBM}`,
    "Content-Type": "application/json",
  },
};

const getTimePlayed = async (steamID) => {
  console.log(steamID)
  const requestBody_BM = {
    data: [
      {
        type: "identifier",
        attributes: {
          type: "steamID",
          identifier: steamID,
        },
      },
    ],
  };

  try {
    
    const res_BM = await axios.post(apiURL_BM, requestBody_BM, headers);
    if (res_BM.data.length == 0) {console.log('Не нашел пользователя в BM', res_BM);return}
    const BMPlayerId = res_BM.data.data[0].relationships.player.data.id  ;
    let playedTimeAllServersBM = 0;
    console.log(res_BM.data.data)
    
    for (let i = 0; i < serverId.length; i++) {
      try {
        const res = await axios.get(
          `https://api.battlemetrics.com/players/${BMPlayerId}/servers/${serverId[i]}`
        );
        if (res.data.data.attributes.timePlayed) {playedTimeAllServersBM += res.data.data.attributes.timePlayed;}
      } catch (err) {
        console.log(err)
      }
    }

    return playedTimeAllServersBM;
  } catch (error) {
    console.log(error)
    console.error("Ошибка при получении данных из Battlemetrics");
  }
};

export default getTimePlayed;
