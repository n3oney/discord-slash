import { ApplicationCommand } from "./ApplicationCommand.ts";
import { ApplicationCommandOption } from "./ApplicationCommandOption.ts";
import { Client } from "./Client.ts";

export class CommandManager {
    constructor(public client: Client) { }

    public cache = new Map<string, ApplicationCommand>();

    public fetchGlobal() {
        return new Promise((resolve, reject) => {
            if (!this.client.botId || !this.client.token) throw new Error("Unauthorized.");

            this.client.request(`https://discord.com/api/v8/applications/${this.client.botId}/commands`, "GET").then(response => {
                if(response.status === 200) {
                    response.json().then(data => {
                        resolve(data.map((a: { id: string; name: string; description: string; options: ApplicationCommandOption[] | undefined; }) => {
                            const c = new ApplicationCommand(this, a.id, a.name, a.description, null, a.options);
                            this.cache.set(c.id, c);
                            return c;
                        }));
                    }, reject);
                } else reject();
            }, reject);
        });
    }

    public fetchGuild(guildID: string): Promise<ApplicationCommand[]> {
        return new Promise((resolve, reject) => {
            if (!this.client.botId || !this.client.token) throw new Error("Unauthorized.");

            this.client.request(`https://discord.com/api/v8/applications/${this.client.botId}/guilds/${guildID}/commands`, "GET").then(response => {
                if(response.status === 200) {
                    response.json().then(data => {
                        resolve(data.map((a: { id: string; name: string; description: string; options: ApplicationCommandOption[] | undefined; }) => {
                            const c = new ApplicationCommand(this, a.id, a.name, a.description, guildID, a.options)
                            this.cache.set(c.id, c);
                            return c;
                        }));
                    }, reject);
                } else reject();
            }, reject);
        });
    }

    public createCommand(options: {
        name: string,
        description: string,
        options?: ApplicationCommandOption[]
    }, guild?: string) {
        if (!this.client.botId || !this.client.token) throw new Error("Unauthorized.");

        return this.client.request(guild ? `https://discord.com/api/v8/applications/${this.client.botId!}/guilds/${guild}/commands` : `https://discord.com/api/v8/applications/${this.client.botId!}/commands`, "POST", options);
    }
}