import { CommandManager } from "./CommandManager.ts";
import { Data } from "./DataType.ts";
import { Interaction } from "./Interaction.ts";
import { GATEWAY_URL, OPCODE } from "./statics.ts";

export class Client {
    public token?: string;
    public botId?: string;

    // EVENTS

    private on_ready = new Set<() => unknown>();

    public onReady(fn: () => unknown) {
        this.on_ready.add(fn);
    }

    public offReady(fn: () => unknown) {
        this.on_ready.delete(fn);
    }


    private on_iteraction_create = new Set<(interaction: Interaction) => unknown>();

    public onInteractionCreate(fn: (interaction: Interaction) => unknown) {
        this.on_iteraction_create.add(fn);
    }

    public offInteractionCreate(fn: (interaction: Interaction) => unknown) {
        this.on_iteraction_create.delete(fn);
    }


    public commands = new CommandManager(this);

    private ws?: WebSocket;
    private heartbeatInterval?: number;

    private lastSequenceNumber?: number | null;

    private heartbeat() {
        if (this.ws) {
            this.ws.send(JSON.stringify({
                op: OPCODE.HEARTBEAT,
                d: this.lastSequenceNumber
            }));
            setTimeout(this.heartbeat.bind(this), this.heartbeatInterval);
        }
    }

    private async websocketReceive(m: MessageEvent) {
        try {

            let data: Data = m.data;

            if (typeof data === "string") data = JSON.parse(data);

            this.lastSequenceNumber = data.s;

            switch (data.op) {
                case OPCODE.HELLO:
                    this.heartbeatInterval = data.d.heartbeat_interval;
                    this.heartbeat();

                    this.ws!.send(JSON.stringify({
                        op: OPCODE.IDENTIFY,
                        d: {
                            token: this.token!,
                            intents: 513,
                            properties: {
                                $os: "linux",
                                $browser: "discord-slash",
                                $device: "discord-slash"
                            }
                        }
                    }));
                    break;

                case OPCODE.DISPATCH:

                    switch (data.t) {
                        case "READY":
                            this.botId = (data.d as { user: { id: string } }).user.id;

                            this.on_ready.forEach(r => r());
                            break;

                        case "INTERACTION_CREATE": {
                            let command = this.commands.cache.get(data.d.data.id);

                            if (!command) {
                                await this.commands.fetchGuild(data.d.guild_id);
                                command = this.commands.cache.get(data.d.data.id)!;
                            }

                            const i = new Interaction(this, command, data.d.id, data.d.token, data.d.guild_id, data.d.channel_id, data.d.type, data.d.data);

                            this.on_iteraction_create.forEach(f => f(i));
                            break;
                        }

                        case "GUILD_CREATE":
                            this.commands.fetchGuild(data.d.id);
                            break;
                    }

                    break;
            }

        // deno-lint-ignore no-empty
        } catch { }
    }

    // deno-lint-ignore no-explicit-any
    public request(uri: string, method: "POST" | "GET" | "DELETE" | "PUT" = "GET", body: any = {}, headers: any = {}) {
        if (!this.token) throw new Error("Unauthorized");

        let b;

        if (typeof body === "string") b = body;
        else if (typeof body === "object" && Object.keys(body).length > 0) b = JSON.stringify(body);

        return fetch(uri, {
            method,
            body: b,
            headers: {
                "Content-Type": "application/json",
                "Authorization": this.token!,
                ...headers
            }
        })
    }

    public async login(token: string) {
        this.token = token.startsWith("Bot ") ? token : `Bot ${token}`;

        if (!token) throw new Error("Invalid token provided.");

        this.ws = new WebSocket(GATEWAY_URL);

        this.ws!.onmessage = this.websocketReceive.bind(this);
    }
}