import { ChatInputCommandInteraction, Client } from "discord.js";
import { exec } from 'child_process';
import DiscordCommandHandler from "../types/command";
import JumpstarterConfiguration from "../types/config";
import os from 'os';

export default class UpdateCommand extends DiscordCommandHandler {

  constructor() {
    super('update', {
      name: 'update',
      description: 'make the server update to the latest version'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.updateCommandEnabled) {
      await interaction.reply({
        content: `:bangbang: The update command is not enabled in the bot configuration file, so you can't do this.`
      });
      return;
    }

    exec('git pull', async (error, stdout, stderr) => {
      await interaction.reply({
        content: `:inbox_tray: Ran \`git pull\` with the following output: \`\`\`\n${stdout}\n\`\`\``
      });
    });
  }

}