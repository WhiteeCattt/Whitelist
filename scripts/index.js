import { world } from "@minecraft/server";
import { DynamicDB } from "./database.js";
import config from "./config";
console.warn("[Whitelist] §l§aReload")

/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Whitelist
*/
const db = new DynamicDB("Whitelist", world)
if (!db.get("Whitelist")) {
    db.set("Whitelist", {
        enable: false,
        players: []
    })
    db.save()
}


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Whitelist
*/
world.beforeEvents.chatSend.subscribe((data) => {
    const { sender: player, message } = data
    const args = message.trim().split(/\s+/g)
    if (message.toLowerCase().startsWith(`${config.cmdPrefix}whitelist`)) {
        data.cancel = true
        if (!player.hasTag(config.adminTag)) return player.sendMessage(config.prefix + "Not enough rights.");
        if (!args[1]) return player.sendMessage(config.prefix + `Whitelist - ${db.get("Whitelist").enable == true ? "§aenabled" : "§cdisabled"}`);
        if (args[1] == "help") {
            player.sendMessage("§2--- Whitelist help ---")
            player.sendMessage(config.cmdPrefix + "whitelist help - whitelist help")
            player.sendMessage(config.cmdPrefix + "whitelist <on/off> - enable/disable whitelist")
            player.sendMessage(config.cmdPrefix + "whitelist add <nickname> - add a player to the whitelist")
            player.sendMessage(config.cmdPrefix + "whitelist remove <nickname> - remove a player to the whitelist")
            player.sendMessage(config.cmdPrefix + "whitelist list - list whitelist players")
        } else if (args[1] == "on") {
            if (db.get("Whitelist").enable == true) return player.sendMessage(config.prefix + "The whitelist is already enabled!");
            db.get("Whitelist").enable = true
            db.save()
            player.sendMessage(config.prefix + "You §aenabled§f the whitelist on the server!")
        } else if (args[1] == "off") {
            if (db.get("Whitelist").enable == false) return player.sendMessage(config.prefix + "The whitelist is already disabled!");
            db.get("Whitelist").enable = false
            db.save()
            player.sendMessage(config.prefix + "You §cdisabled§f the whitelist on the server!")
        } else if (args[1] == "add") {
            if (!args[2]) return players.sendMessage(config.prefix + `Use §g${config.cmdPrefix}whitelist add <nickname>`);
            if (db.get("Whitelist").players.includes(args[2])) return player.sendMessage(config.prefix + `Player §g${args[2]}§r has already been added to the whitelist!`);
            db.get("Whitelist").players.push(args[2])
            db.save()
            player.sendMessage(config.prefix + `You have added the player §g${args[2]}§r to the whitelist!`)
        } else if (args[1] == "remove") {
            if (!args[2]) return players.sendMessage(config.prefix + `Use §g${config.cmdPrefix}whitelist removex <nickname>`);
            if (!db.get("Whitelist").players.includes(args[2])) return player.sendMessage(config.prefix + `Player §g${args[2]}§r is not on the whitelist!`);
            const index = db.get("Whitelist").players.findIndex(player => player === args[2])
            if (index !== -1) {
                db.get("Whitelist").players.splice(index, 1)
            }
            db.save()
            player.sendMessage(config.prefix + `You have removed player §g${args[2]}§r from the whitelist!`)
        } else if (args[1] == "list") {
            player.sendMessage(config.prefix + `${db.get("Whitelist").players.length == 0 ? "There are no players on the whitelist!" : `§g${db.get("Whitelist").players.join("§r, §g")}`}`)
        } else {
            player.sendMessage(config.prefix + `Unknown argument! Use §g${config.cmdPrefix}whitelist help`)
        }
    }
})


/**
 * Copyright (C) 2024 WhiteeCattt
 * GitHub: https://github.com/WhiteeCattt/
 * Project: https://github.com/WhiteeCattt/Whitelist
*/
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    if (player.hasTag(config.adminTag)) return;
    if (db.get("Whitelist").enable !== true) return;
    if (db.get("Whitelist").players.includes(player.name)) return;
    player.runCommandAsync(`kick "${player.name}" §r\nSorry, but you are not on the whitelist!`)
})
