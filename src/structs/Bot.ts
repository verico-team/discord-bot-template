import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { join, extname } from 'path'
import config from '../config'
import { Event } from '../interfaces/Event'
import { Command } from '../interfaces/Command'

export class Bot {
    public commands: Command[] = []

    public constructor(public readonly client: Client) {
        (async () => {
            let start = Date.now()
            console.log("Bot is starting...")

            await this.registerEvents()

            this.client.on("ready", async () => {
                console.log(`${this.client.user!.username} is ready! Took: ${Date.now() - start}ms`);
            });
            
            this.client.login(config.discord.token)

            this.client.on("warn", console.log);
            this.client.on("error", console.error);
        })()
    }

    private async registerEvents() {
        // Register events @ events folder
        const eventsDir = join(__dirname, '..', "events")
        for (const file of readdirSync(join(eventsDir))){
            const filePath = join(eventsDir, file)
            if (extname(filePath) != '.js' && extname(filePath) != '.ts' ) continue;
            
            const event: Event = (await import(filePath)).default

            this.client[event.once ? "once" : "on"](event.event, (...args) => {
                event.execute(this, ...args)
            });
        }
    }
}