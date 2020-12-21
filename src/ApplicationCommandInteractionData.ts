import { ApplicationCommandInteractionDataOption } from "./ApplicationCommandInteractionDataOption.ts";

export interface ApplicationCommandInteractionData {
    id: string,
    name: string,
    options?: ApplicationCommandInteractionDataOption[]
}