import { ApplicationCommand } from "./ApplicationCommand.ts";
import { ApplicationCommandInteractionData } from "./ApplicationCommandInteractionData.ts";
import { Client } from "./Client.ts";
import { GuildMember } from "./GuildMember.ts";

export enum InteractionResponseType {
    Pong = 1,
    Acknowledge = 2,
    ChannelMessage = 3,
    ChannelMessageWithSource = 4,
    ACKWithSource = 5
}

export enum InteractionType {
    Ping = 1,
    ApplicationCommand = 2
}

export class Interaction {
    public version = 1;

    constructor(public client: Client, public command: ApplicationCommand, public id: string, public token: string, public member: GuildMember, public guild: string, public channel: string, public type: InteractionType, public data?: ApplicationCommandInteractionData) { }

    reply(content: string | null, responseType: InteractionResponseType = InteractionResponseType.ChannelMessageWithSource, embeds: unknown[] = [], allowedMentions?: string[]) {
        return this.client.request(`https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`, "POST", {
            type: responseType,
            data: {
                tts: false,
                content,
                embeds,
                allowed_mentions: allowedMentions
            }
        });
    }
}