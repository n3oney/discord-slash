import { OPCODE } from "./statics.ts";

export type Data = 
    {t: null, s: null, op: OPCODE.HELLO, d: { heartbeat_interval: number, _trace: string[] }} |
    {t: null, s: null, op: OPCODE.HEARTBEAT_ACK, d: null} |
    {t: "READY", op: OPCODE.DISPATCH, s: null, d: unknown} |
    {t: "INTERACTION_CREATE", op: OPCODE.DISPATCH, s: null, d: {
        version: 1,
        type: 1 | 2,
        id: string
        token: string,
        // deno-lint-ignore no-explicit-any
        data?: any,
        guild_id: string,
        channel_id: string,
        member: { user: { username: string, public_flags: number, id: string, discriminator: string, avatar: string }, roles: string[], premium_since?: string, permissions: string, pending: boolean, nick?: string, mute: boolean, joined_at: string, is_pending: boolean, deaf: boolean }
    }} |
    // deno-lint-ignore no-explicit-any
    any