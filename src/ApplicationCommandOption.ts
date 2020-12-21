import { ApplicationCommandOptionChoice } from "./ApplicationCommandOptionChoice.ts";
import { APPLICATION_COMMAND_OPTION_TYPE } from "./statics.ts";

export interface ApplicationCommandOption {
    name: string,
    description: string,
    required?: boolean,
    default?: boolean,
    type: APPLICATION_COMMAND_OPTION_TYPE,
    options?: ApplicationCommandOption[],
    choices?: ApplicationCommandOptionChoice[]
}