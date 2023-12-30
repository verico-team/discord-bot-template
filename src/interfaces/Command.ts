import { SlashCommandBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    id: string | undefined;
    execute(...args: any): any;
}