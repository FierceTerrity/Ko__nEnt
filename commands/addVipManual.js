import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "dotenv";
import vipCreater from "../utility/vip-creater.js";
config();
const allowedChannelId = process.env.ADD_VIP_MANUAL_CHANNELID
const addVipCommand = new SlashCommandBuilder()
  .setName("addvip")
  .setDescription("Команда для добавления VIP вручную")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
addVipCommand.addStringOption((option) =>
  option
    .setName("steamid64")
    .setDescription("Введите 17 цифр steamID64 для получения статистики игрока")
    .setRequired(true)
    .setMaxLength(17)
    .setMinLength(17)
);
addVipCommand.addStringOption((option) =>
  option
    .setName("discordid")
    .setDescription("Введите discordID игрока")
    .setRequired(true)
);
addVipCommand.addStringOption((option) =>
  option
    .setName("сумма")
    .setDescription("Введите сумму доната")
    .setRequired(true)
);

addVipCommand.addStringOption((option) =>
  option.setName("имя").setDescription("Введите имя игрока").setRequired(true)
);

const execute = async (interaction) => {
  try {
    const steamid64 = interaction.options.getString("steamid64");
    const discordid = interaction.options.getString("discordid");
    const sum = interaction.options.getString("сумма");
    const name = interaction.options.getString("имя");
    const channelId = interaction.channelId;
    if (channelId !== allowedChannelId) {
      return await interaction.reply({
        content:
          "Команда доступна только Администраторам в канале 'выдать випку'",
        ephemeral: true,
      });
    }

    try {
      const user = await interaction.guild.members.fetch(discordid);
      const vipRole = interaction.guild.roles.cache.find(
        (role) => role.name === "VIP"
      );
      await user.roles.add(vipRole);
    } catch (error) {}

    vipCreater.vipCreater(steamid64, name, sum, discordid);
    await interaction.reply(
      `Игроку ${name} ${steamid64} ${discordid} был выдан VIP слот и роль`
    );
  } catch (error) {
    await interaction.reply({
      content: "Произошла ошибка.",
      ephemeral: true,
    });
  }
};

export default { data: addVipCommand, execute };

