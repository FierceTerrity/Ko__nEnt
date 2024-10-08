import axios from "axios";
import checkBansFromBattlemetrics from "./checkBansFromBattlemetrics.js";
import { config } from "dotenv";
config();

async function searchBanFromBattlemetrics(message) {
  const apiKey = process.env.BATTLEMETRICS_API_KEY;

  if (!apiKey) {
    console.error(
      "Отсутствует ключ API для Battlemetrics. Проверьте настройки."
    );
    return;
  }

  const name = encodeURI(message.content);
  const searchUrl = `https://api.battlemetrics.com/bans?filter[organization]=${process.env.BM_ORG_ID}&filter[search]="${name}"`;

  try {
    const response = await axios.get(searchUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const { data } = response;
    await checkBansFromBattlemetrics(data.data, message);
  } catch (error) {
    console.error("Произошла ошибка при выполнении запроса:", error);
  }
}

export default searchBanFromBattlemetrics;
