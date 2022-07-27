import { ActionRowBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";
import ngrok from 'ngrok';

export default class NgrokKillCommand extends DiscordCommandHandler {

  constructor() {
    super('ngrokkill', {
      name: 'ngrokkill',
      description: 'Kill the ngrok agent'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }

    await ngrok.kill();

    await interaction.reply({
      content: ':stop_sign: Successfully killed the ngrok agent. It can be restarted by starting an ngrok service using `/ngrokstart`'
    });
  }

}