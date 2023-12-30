import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Bot } from "../../structs/Bot";

export = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Sends the current discord server's ping"),
    execute: async function(bot: Bot, interaction: CommandInteraction){
        const start = Date.now()
        await interaction.reply({ content: 'Checking ping...', ephemeral: true })

        await interaction.editReply({ content: `Ping: ${(Date.now()-start)}`})
    }
}