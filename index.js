import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  TextInputStyle,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import getCommands from "./commands/getCommands.js";
import { config } from "dotenv";
config();
import cleaner from "./utility/vip-cleaner.js";
import top20StatsMain from "./utility/top20StatsMain.js";
import top20StatsTemp from "./utility/top20StatsTemp.js";
import getDonate from "./utility/getDonate.js";
import getBanFromBattlemetrics from "./utility/getBansFromBattlemetrics.js";
//import chartInitialization from "./chartInitialization.js";
import { exec } from "child_process";
import getSteamIdModal from "./utility/getSteamIdModal.js";
import getSteamIdFormSubmit from "./utility/getSteamIdFormSubmit.js";
import donateInteraction from "./utility/donateInteraction.js";
import checkDonateNew from "./utility/checkDonateNew.js";
import bonusInteraction from "./utility/bonusInteraction.js";
import checkVipInteraction from "./utility/checkVipInteraction.js";
// import rulesDiscord from "./utility/rulesDiscord.js";
// import rulesPalWorld from "./utility/rulesPalWorld.js";
// import rulesSquad from "./utility/rulesSquad.js";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
const commands = await getCommands();

for (const command of commands) {
  if ("data" in command && "execute" in command)
    client.commands.set(command.data.name, command);
  else logger.verbose("discord", 1, `The command missing! in index.js`);
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Список каналов
  const leaderboadChannelMainId = client.channels.cache.get(
    process.env.LEADERBOARD_MAIN_CHANNELID
  );
  const leaderboadChannelTempId = client.channels.cache.get(
    process.env.LEADERBOARD_TEMP_CHANNELID
  );
  const guildId = client.guilds.cache.get(process.env.GUILD_ID); // ID Сервера
  const donateChannelId = client.channels.cache.get(process.env.DONATE_CHANNELID); // ID канала с донатами
  const checkDonateChannelId = client.channels.cache.get(process.env.DONATE_CHANNELID); // ID канала с донатами
  // const threadChannelId = client.channels.cache.get("1204124602230374471");
  const bansChannelId = process.env.BANS_CHANNELID;  // ID канала с банами
  const memeChannelId = process.env.MEME_CHANNELID; // ID канала с meme

  // Все остальные каналы из енвов
  const activitiAdminsChannelId = process.env.ADMINACTIVITY_CHANNELID;
  const vipManualChannelId = process.env.VIP_CHANNELID;
  const statsChannesId1 = process.env.STATS_CHANNELID;
  const statsChannesId2 = process.env.STATS_CHANNELID2;
  const db = process.env.DATABASE_URL;
  const steamApi = process.env.STEAM_API;
  const donateUrl = process.env.DONATE_URL;
  const adminsUrl = process.env.ADMINS_URL;







  setInterval(() => {
    checkDonateNew(guildId, db, steamApi, donateUrl);
  }, 60000);


  setInterval(() => {
    top20StatsMain(leaderboadChannelMainId, db);
    //top20StatsTemp(leaderboadChannelTempId, db);
    //chartInitialization(tickRateChannelId);
  }, 600000);


  cleaner.vipCleaner((ids) => {
    try {
      ids.forEach(async (element) => {
        let role =
          guildId.roles.cache.find((r) => r.name === "VIP") ||
          (await guildId.roles.fetch(process.env.VIP_ROLE_ID));
        let getUserList = await guildId.members
          .fetch({ cache: true })
          .catch(console.error);
        let findUser = getUserList.find((r) => r.user.id === element);

        if (!findUser) { console.log(`DONT FIND FINDUSERS`); return };
        console.log("TRY SEND MESSAGE TO ", findUser.user.username)
        findUser
          .send(
            'Ваш Vip статус на сервере "Лучшие в Аду" закончился'
          )
          .catch((error) => {
            console.log("Невозможно отправить сообщение пользователю");
          });
        findUser.roles.remove(role);
      })
    } catch (e) {
      console.log(e)
    }
  }

  );

  client.on("messageCreate", async (message) => {
    //if (message.channelId == '1259074768557309964') { message.channel.send('TEST')}
    if (message.author.bot) return;
    
    if ((message.channelId == '1259074768557309964' || message.channelId == '1259074768557309964') && message.content === 'create') {
      console.log('ok')
      message.channel.send('Топ 20 игроков по убийствам')
      message.channel.send('Топ 20 игроков по смертям')
      message.channel.send('Топ 20 медиков')
      message.channel.send('Топ 20 тимкилеров')
      message.channel.send('Топ 20 игроков по соотношению убийств к смертям')
    }
    // if (message.channelId === "1200212158282207293") rulesDiscord(message);
    // if (message.channelId === "1200212107271077930") rulesPalWorld(message);

    // serverlist ("galactic", "vanila", "mee", "squadv")
    // if (message.channelId === "1119060668046389308") {
    //   rulesSquad("galactic", threadChannelId);
    //   rulesSquad("mee", threadChannelId);
    //   rulesSquad("squadv", threadChannelId);
    //   rulesSquad("squad", threadChannelId);
    // }

    // if (message.channelId === "1189653903738949723") {
    //   const imagePath1 = "../image1.png";
    //   const imagePath2 = "../image2.png";

    //   const attachment1 = new AttachmentBuilder(imagePath1, {
    //     name: "image1.png",
    //   });
    //   const attachment2 = new AttachmentBuilder(imagePath2, {
    //     name: "image2.png",
    //   });

    //   message.channel.send({ files: [attachment2] });

    //   const embed1 = new EmbedBuilder().setColor("#275318").setDescription(
    //     `⠀⠀В награду за активность на наших игровых серверах, мы поощряем игроков предоставлением **VIP** статуса. Для этого в игре действует система бонусных баллов.
    //       ⠀Каждому игроку начисляется 1 бонусный балл за 1 минуту, проведенную на игровом сервере, на обычной карте и 2 бонусных балла за 1 минуту на seed-карте.
    //       ⠀За каждые __15000 бонусных__ баллов можно активировать **VIP** статус сроком на 1 месяц. Узнать количество начисленных бонусных баллов можно в игре на нашем сервере написав в чат команду \`"!bonus"\`.

    //       ⠀Чтобы активировать **VIP** за бонусные баллы нажмите на кнопку \`"VIP статус за бонусные баллы"\`.

    //       ⠀Пожалуйста, обратите внимание, что **VIP** статус в игре начнет действовать только после смены карты на сервере!`
    //   );

    //    message.channel.send({ embeds: [embed1] });

    //   const cancel = new ButtonBuilder()
    //     .setCustomId("donatVip")
    //     .setLabel("VIP статус за донат")
    //     .setStyle("Success");

    //   const bonus = new ButtonBuilder()
    //     .setCustomId("bonusVip")
    //     .setLabel("VIP статус за бонусные баллы")
    //     .setStyle("Success");

    //   const checkVip = new ButtonBuilder()
    //     .setCustomId("checkVip")
    //     .setLabel("Проверить VIP статус")
    //     .setStyle("Primary");

    //   const row = new ActionRowBuilder().addComponents(cancel, bonus, checkVip);

    //   await message.channel.send({
    //     components: [row],
    //   });
    // }
    ///// override ^^^ Создать кнопки в канале с випами
    if (message.channelId === '1212370966110412820' && message.content === 'create btn') {
      try {
        const cancel = new ButtonBuilder()
          .setCustomId("donatVip")
          .setLabel("VIP статус за донат")
          .setStyle("Success");

        const bonus = new ButtonBuilder()
          .setCustomId("bonusVip")
          .setLabel("VIP статус за бонусные баллы")
          .setStyle("Success");

        const checkVip = new ButtonBuilder()
          .setCustomId("checkVip")
          .setLabel("Проверить VIP статус")
          .setStyle("Primary");

        const row = new ActionRowBuilder().addComponents(cancel, bonus, checkVip);

        await message.channel.send({
          components: [row],
        });
      } catch (e) {
        console.log(e)
      }

    }

    /////
    // Автоудаление сообщений в каналах в которых можно использовать только команды
    const allowedCommandChannels = [
      activitiAdminsChannelId,
      vipManualChannelId,
      statsChannesId1,
      statsChannesId2,
    ];

    if (allowedCommandChannels.includes(message.channel.id)) {
      if (!message.interaction) {
        try {
          await message.delete();
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      }
    }

    // Канал для вывода списка донатов
    if (message.channelId === checkDonateChannelId.id)
      await getDonate(process.env.DONATE_URL, donateChannelId);

    if (bansChannelId.includes(message.channelId)) {
      getBanFromBattlemetrics(message);
    }
    // в канале для мемов оставляем только картинки, текст удаляется
    if (memeChannelId.includes(message.channelId)) {
      if (message.attachments.size > 0) {
        const isImage = message.attachments.every(
          (attachment) =>
            /\.(jpg|jpeg|png|gif)$/.test(attachment.url) ||
            /\.(jpg|jpeg|png|gif)(\?.*)?$/.test(attachment.url)
        );

        if (!isImage) {
          message.delete();
        }
      } else if (
        !/\.(jpg|jpeg|png|gif)$/.test(message.content) &&
        !/\.(jpg|jpeg|png|gif)(\?.*)?$/.test(message.content)
      ) {
        message.delete();
      }
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if (interaction.isModalSubmit()) {
      const steamIdField = interaction.fields.fields.get("steamid64input");

      if (steamIdField) {
        const steamLink = steamIdField.value;
        getSteamIdFormSubmit(interaction, steamLink, db, steamApi);
      }
    }

    if (interaction.isChatInputCommand()) {
      try {
        //console.log(interaction)
        await command.execute(interaction);
      } catch (error) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isButton()) {
      const commandName = interaction?.message?.interaction?.commandName;
      const buttonId = interaction?.customId;

      if (buttonId === "SteamID") {
        await getSteamIdModal(interaction);
      }
      if (buttonId === "donatVip") {
        await donateInteraction(interaction, db);
      }
      if (buttonId === "bonusVip") {
        await bonusInteraction(interaction, db);
      }
      if (buttonId === "checkVip") {
        await checkVipInteraction(interaction, adminsUrl);
      }
      //// Закомментил рестарт
      // if (commandName === "restart") {
      //   const userID = interaction.user.id;
      //   const { customId } = interaction;
      //   const serverNumber = customId.replace("server", "");

      //   try {
      //     exec(`pm2 restart SERVER${serverNumber}`, (error) => {
      //       if (error) {
      //         console.error(`Ошибка: ${error}`);
      //       }
      //     });

      //     await interaction.channel.send({
      //       content: `<@${userID}> Бот #${serverNumber} RNS перезагружен!`,
      //     });
      //     await buttonInteraction(interaction);
      //     console.log(`<@${userID}> Бот #${serverNumber} RNS перезагружен!`);
      //   } catch (error) {
      //     console.error("Ошибка при обработке взаимодействия:", error);
      //   }
      //   return;
      // }
    }
  });

  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      console.log('VOICE UPDATE')
      const newUserChannel = newState.channel;
      const oldUserChannel = oldState.channel;
      //console.log(oldUserChannel, '\nTTT\n', newUserChannel)
      const channelIdToCreate = process.env.VOICE_CHANNELID;
      const categoryId = process.env.VOICE_CHANNEL_CATEGORY_ID;
      let newChannel;
      // Функция для создания разрешений для ролей
      const createRolePermissions = () => ({
        ViewChannel: true,
        AddReactions: true,
        Stream: true,
        SendMessages: true,
        AttachFiles: true,
        Connect: true,
        Speak: true,
      });

       // Проверяем, если пользователь входит в канал для создания
       //console.log(newUserChannel.id, "\n\n", channelIdToCreate)
       //console.log(newUserChannel + '==' + oldUserChannel)
      if (
        newUserChannel?.id === channelIdToCreate &&
        !oldUserChannel &&
        newUserChannel
      ) {
        const playerName = newState.member.displayName;
        const rolesToAllow = [
          "Генерал",
          "Замполит",
          "Офицер",
          "Сержант",
          "Курсант",
          "Роль",
        ];
        newChannel = await newUserChannel.guild.channels.create({
          name: playerName,
          type: "2",
          parent: categoryId,
        });

        const everyoneRole = newState.guild.roles.everyone;

        // Создаем разрешения для ролей
        const rolePermissions = rolesToAllow.map((roleName) => {
          const role = newState.guild.roles.cache.find(
            (role) => role.name === roleName
          );
          if (role) {
            return newChannel.permissionOverwrites.create(
              role,
              createRolePermissions(role, true)
            );
          } else {
            console.log(`Роль ${roleName} не найдена.`);
            return null;
          }
        });

        const memberPermission = newChannel.permissionOverwrites.create(
          newState.member,
          createRolePermissions(newState.member)
        );

        // Создаем разрешения для @everyone
        const everyonePermission = newChannel.permissionOverwrites.create(
          everyoneRole,
          {
            ViewChannel: false,
          }
        );

        // Ждем завершения всех операций по созданию разрешений
        await Promise.all([
          ...rolePermissions,
          memberPermission,
          everyonePermission,
        ]);

        // Перемещаем пользователя в созданный канал
        try {
          await newState.member.voice.setChannel(newChannel);
        } catch (error) {
          await newChannel.delete();
        }
      }

      // Проверяем, если пользователь покидает любой канал в категории
      //console.log(oldUserChannel?.parentId, ' ? ', categoryId)
      //console.log(oldUserChannel?.id, ' ? ', channelIdToCreate)
      if (
        oldUserChannel?.parentId === categoryId &&
        oldUserChannel?.id !== channelIdToCreate
      ) {
        if (oldUserChannel?.members?.size === 0) {
          await oldUserChannel.delete();
        }
      }

    } catch (e) {
      console.log(e)
    }
  })
  });

  await client.login(process.env.CLIENT_TOKEN);
