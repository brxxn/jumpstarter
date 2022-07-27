import { ChatInputCommandInteraction, Client } from "discord.js";
import DiscordCommandHandler from "../types/command";
import JumpstarterConfiguration from "../types/config";
import os from 'os';

export default class UptimeCommand extends DiscordCommandHandler {

  constructor() {
    super('uptime', {
      name: 'uptime',
      description: 'see how long the server (and bot) have been online'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    await interaction.reply({
      content: `Process uptime: \`${process.uptime()} seconds\`\nServer uptime: \`${os.uptime()} seconds\``
    });
  }

}