import { CommandInteraction, Events } from "discord.js";
import { Bot } from "../structs/Bot";

export = {
    event: Events.InteractionCreate,
    execute: async function(bot: Bot, interaction: CommandInteraction){
        if (!interaction.isCommand()) return

        for(const command of bot.commands){
            if (command.id != interaction.commandId) continue;

            command.execute(bot, interaction)

            return true;
        }
    }
}