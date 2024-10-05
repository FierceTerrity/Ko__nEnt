import fs from "fs";

async function dateDonateExpires(adminUrl, interaction) {
  const currentUser = [];
  const date = [];
  
  const regexp = new RegExp(`^Admin=[0-9]*:Reserved \/\/ DiscordID ${interaction.user.id} do [0-9]{2}\.[0-9]{2}\.[0-9]{4}`, 'gm')
  console.log(regexp)
  fs.readFile(`${adminUrl}Admins.cfg`, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const user = data.match(regexp)
    console.log(user)
    if (user) {
      interaction.reply(`Дата окончания VIP статуса ${user[0].split('do')[1].toString()}`) // TODO чекнуть что там не может быть повторений
    }
    else {
      interaction.reply(`Пользователь с VIP статусом не найден`)
    }
    
  });
}
export default dateDonateExpires;
