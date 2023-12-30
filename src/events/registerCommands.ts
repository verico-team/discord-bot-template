import { readdirSync } from "fs"
import { Bot } from "../structs/Bot"
import { join } from 'path'
import { Command } from "../interfaces/Command"
import { Events, REST, Routes } from "discord.js"
import config from "../config"

export = {
    event: Events.ClientReady,
    execute: async function(bot: Bot){
        const slashCommands: Command[] = []

        const commandFoldersPath = join(__dirname, '..', 'commands')
        const commandFolders = await readdirSync(commandFoldersPath)
        for (const commandFolder of commandFolders) {
            const commandFolderPath = join(commandFoldersPath, commandFolder)
            for (const command of await readdirSync(commandFolderPath)){
                const commandImported = (await import(join(commandFolderPath, command))).default
                
                slashCommands.push(commandImported.data.toJSON())
                bot.commands.push(commandImported)
            }
        }

        const rest = new REST().setToken(config.discord.token ? config.discord.token : "");

        try {
            console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(config.discord.clientId ? config.discord.clientId : ""),
                { body: slashCommands },
            );

            if (!(data instanceof Array)) throw Error("data's type is not valid.")
            
            for (let i=0; i<data.length; i++){
                const command = data[i]

                bot.commands[i].id = command.id
            }

            console.log(`Successfully reloaded ${slashCommands.length} application (/) commands.`);
        }catch(error){
            console.error(error);
        }
    }  
}