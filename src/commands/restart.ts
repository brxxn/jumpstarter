import { ChatInputCommandInteraction, Client } from "discord.js";
import { exec } from 'child_process';
import DiscordCommandHandler from "../types/command";
import JumpstarterConfiguration from "../types/config";
import os from 'os';

export default class RestartCommand extends DiscordCommandHandler {

  constructor() {
    super('restart', {
      name: 'restart',
      description: 'Restarts the bot (do not use if you are not using systemctl)'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.restartCommandEnabled) {
      await interaction.reply({
        content: `:bangbang: The restart command is not enabled in the bot configuration. Note that before you enable it, you need to make sure you have systemctl setup to restart the bot after the process exits.`
      });
      return;
    }

    await interaction.reply({
      content: `:repeat: Restarting bot, please wait...\n*(note: if you do not have systemctl setup to automatically restart your bot, you will need to manually start it.)*`
    });
    process.exit(0);
  }

}