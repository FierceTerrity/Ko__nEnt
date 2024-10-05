import fs from "fs";

const servers = [
  {
    name: "Vanila 1  - Москва",
    id: "BIH_V_1",
    adminCfgUrl: "c:/ServerFiles/server1/SquadGame/ServerConfig/",
  },
  {
    name: "Vanila 2 -  Тула",
    id: "BIH_V_2",
    adminCfgUrl: "c:/ServerFiles/server2/SquadGame/ServerConfig/",
  },
  {
    name: "GlobalEscalation 1 -  Минск",
    id: "BIH_GE_1",
    adminCfgUrl: "c:/ServerFiles/server3_ge_1/SquadGame/ServerConfig/",
  },
  {
    name: "GlobalEscalation 2 -  Севастополь",
    id: "BIH_GE_2",
    adminCfgUrl: "c:/ServerFiles/server4_ge_2/SquadGame/ServerConfig/",
  },
];

export default function syncAdminsCfg(serverId) {
  try {
    // Берем конифг который нужно синхронизировать
    const serverCfg = servers.filter((el) => {
      return el.id === serverId;
    })[0].adminCfgUrl;
    if (!serverCfg) {
      console.log("Не найден мастер сервер");
      return;
    }

    // Смотрим где его нужно заменить
    const serverToSync =
      servers.filter((el) => {
        return el.id !== serverId;
      }) || null;
    if (!serverToSync) {
      console.log(
        "Нет серверов,с которыми необходимо синхронизировать Admin.cfg"
      );
      return;
    }
    // Считываем конфиг
    const data = fs.readFileSync(`${serverCfg}Admins.cfg`, "utf-8");
    if (serverToSync) {
      for (let i = 0; i < serverToSync.length; i++) {
        console.log("Запись в ", serverToSync[i].adminCfgUrl + "Admins.cfg");
        fs.writeFile(
          `${serverToSync[i].adminCfgUrl}Admins.cfg`,
          data,
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(
                `Конфиг сервера ${serverToSync[i].name} успешно синхронизирован по пути: ${serverToSync[i].adminCfgUrl} `
              );
            }
          }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
}
