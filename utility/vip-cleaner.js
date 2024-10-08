import fs from "fs";
import { config } from "dotenv";
import syncAdminsCfg from "../scripts/syncAdminsCfg.js";
config();
const timeToExecute = 18000000


const regexp =
  /^Admin=(?<steamID>[0-9]*):Reserved [//]* DiscordID (?<discordId>[0-9]*) do (?<date>[0-9]{2}\.[0-9]{2}\.[0-9]{4})/gm;

const getUserRegExp = (steamID) => {
  return new RegExp(
    `Admin=(?<steamID>${steamID}):Reserved [//]* DiscordID (?<discordId>[0-9]*) do (?<date>[0-9]{2}\\.[0-9]{2}\\.[0-9]{4})`
  );
};
const adminsCfgPath = process.env.ADMINS_URL;
const vipCleaner = (callback) => {
  setInterval(() => {
    console.log(`Vip Cleaner started`)
    const isPaidDate = (date) => {
      const lastVipDate = new Date(Date.parse(`${date} GMT`));
      const currentDate = new Date();
      return lastVipDate > currentDate;
    };

    fs.readFile(`${adminsCfgPath}Admins.cfg`, "utf-8", (err, data) => {
      if (err) {console.log(err);return};

      let newData = "";
      let steamIDForRemove = [];
      let usersRemove = [];
      let usersRemoveId = [];
      const vips = data.matchAll(regexp);
      for (let result of vips) {
        const { steamID, date } = result.groups;
        const reverseDate = date.split(".").reverse().join(".");

        if (!isPaidDate(reverseDate)) {
          steamIDForRemove.push(steamID);
        }
      }

      if (steamIDForRemove.length) {
        if (!data.match(/\r\n/gm)) {
          data = data.replace(/\n/gm, "\r\n");
        }
        let users = data.split("\r\n");
        steamIDForRemove.forEach((e) => {
          const userString = data.match(getUserRegExp(e));
          usersRemove.push(userString[0]);
          users = users.filter((e) => userString[0] !== e);
          usersRemoveId.push(userString.groups.discordId);
          console.log(usersRemoveId,usersRemove)
        });
        
        callback(usersRemoveId);
        newData = users.join("\r\n");
        //console.log(newData)
      }
      
      if (newData.length) {
        fs.writeFile(`${adminsCfgPath}Admins.cfg`, newData, (err) => {
          if (err) return;
          console.log("\x1b[33m", "\r\n Removed users:\r\n");
          usersRemove.forEach((e) => {
            console.log("\x1b[36m", e);
          });

          fs.writeFile(
            `${adminsCfgPath}Backups/AdminsBackup${new Date().toLocaleString(
              "ru-RU",
              {
                timeZone: "Europe/Moscow",
              }
            ).split(',')[0]}.cfg`,
            data,
            (err) => {
              if (err) return;

              console.log(
                "\x1b[33m",
                "\r\n Backup created AdminsBackup.cfg\r\n"
              );
            }
          );
          syncAdminsCfg('BIH_V_1')
        });
        
      }
    });
    console.log(`Vip Cleaner ended`)
  }, timeToExecute);
};
export default {
  vipCleaner,
};
