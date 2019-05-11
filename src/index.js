//* Load .env file
require("dotenv").config();

var Discord = require("discord.js"),
  { error } = require("./util/debug");

//TODO Idle presence when production env
//* Create new client & set login presence
var client = new Discord.Client({
  presence: {
    status: process.env.NODE_ENV == "dev" ? "dnd" : "online",
    activity: {
      name: "Netflix",
      type: "WATCHING"
    }
  }
});

//* Commands, Command aliases, Command permission levels
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.elevation = message => {
  //* Permission level checker
  var permlvl = 0;

  //TODO Add permlvl checks

  //* Return permlvl
  return permlvl;
};

//! Make sure that database is connected first then proceed
(async () => {
  if (moduleInstalled("mysql2")) await require("./database/db");

  //* Load modules
  require("./util/moduleLoader")(client);
  //* Login bot
  client
    .login(
      process.env.NODE_ENV == "dev" ? process.env.TOKEN_BETA : process.env.TOKEN
    )
    .catch(err => error(err.message));
})().catch(error);

function moduleInstalled(path) {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}
