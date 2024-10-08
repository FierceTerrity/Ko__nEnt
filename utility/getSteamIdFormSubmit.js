import { MongoClient } from "mongodb";
import getSteamId64 from "./getSteamID64.js";
import { config } from "dotenv";
config()

async function steamIdFormSubmit(interaction, steamLink, dbLink, steamApi) {
  const clientdb = new MongoClient(dbLink);
  const dbName = process.env.DB_NAME;
  const dbCollection = "mainstats";
  const discordId = interaction.user.id;

  try {
    const steamId = await getSteamId64(steamApi, steamLink);
    if (steamId) {
      await clientdb.connect();
      const db = clientdb.db(dbName);
      const collection = db.collection(dbCollection);
      const existingDiscord = await collection.findOne({
        discordid: discordId,
      });
      const existingSteam = await collection.findOne({ _id: steamId });

      if (!existingSteam) {
        return interaction.reply({
          content:
            "Пользователь не найден в списках игроков, проверьте правильность ввода Steam профиля",
          ephemeral: true,
        });
      }

      if (existingSteam && existingSteam.discordid === discordId) {
        return interaction.reply({
          content:
            "Указанный Steam профиль уже привязан к вашему Discord аккаунту!",
          ephemeral: true,
        });
      }

      if (existingSteam && existingSteam.discordid) {
        return interaction.reply({
          content:
            "Указанный Steam профиль уже привязан к другому Discord аккаунту. Если это ваш SteamID, обратитесь к администратору https://discord.com/channels/735515208348598292/1068565169694851182!",
          ephemeral: true,
        });
      }

      if (existingDiscord && existingDiscord._id) {
        return interaction.reply({
          content: "Ваш Discord аккаунт уже привязан к другому Steam профилю!",
          ephemeral: true,
        });
      }

      const filter = {
        _id: steamId,
      };

      const update = {
        $set: {
          discordid: discordId,
        },
      };

      await collection.updateOne(filter, update, {
        upsert: true,
      });

      await clientdb.close();

      return interaction.reply({
        content: `Steam профиль успешно привязан к аккаунту!\nСкопируйте ваш SteamID: **${steamId}** или свою ссылку на Steam профиль\nВставьте его в поле 'Сообщение стримеру' по ссылке https://new.donatepay.ru/@bih/`,
        ephemeral: true,
      });
    }
  } catch (e) {
    console.error("Error in steamIdFormSubmit:", e);
  }
}

export default steamIdFormSubmit;
