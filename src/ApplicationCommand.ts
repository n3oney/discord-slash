import { ApplicationCommandOption } from "./ApplicationCommandOption.ts";
import { CommandManager } from "./CommandManager.ts";

export class ApplicationCommand {
    constructor(public commandManager: CommandManager, public id: string, public name: string, public description: string, public guild: string | null, public options: ApplicationCommandOption[] = []) { }
}