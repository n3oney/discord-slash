export interface ApplicationCommandInteractionDataOption {
    name: string,
    value?: string | number | boolean,
    options?: ApplicationCommandInteractionDataOption[]
}