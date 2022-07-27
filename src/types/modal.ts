import { Client, ModalSubmitInteraction } from "discord.js";
import JumpstarterConfiguration from "./config";

export default abstract class DiscordModalInteractionHandler {

  id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId() {
    return this.id;
  }

  abstract execute(interaction: ModalSubmitInteraction, config: JumpstarterConfiguration, client: Client): Promise<void>;

}