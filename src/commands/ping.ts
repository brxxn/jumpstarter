import { ChatInputCommandInteraction, Client } from "discord.js";
import DiscordCommandHandler from "../types/command";
import JumpstarterConfiguration from "../types/config";

export default class PingCommand extends DiscordCommandHandler {

  constructor() {
    super('ping', {
      name: 'ping',
      description: 'check to see if the bot is online'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    await interaction.reply({
      content: 'Pong!'
    });
  }

}