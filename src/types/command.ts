import { ChatInputCommandInteraction, Client } from "discord.js";
import JumpstarterConfiguration from "./config";

export default abstract class DiscordCommandHandler {

  name: string;
  data: any;

  constructor(name: string, data: any) {
    this.name = name;
    this.data = data;
  }

  getName() {
    return this.name;
  }

  getData() {
    return this.data;
  }

  abstract execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client): Promise<void>;
  
}