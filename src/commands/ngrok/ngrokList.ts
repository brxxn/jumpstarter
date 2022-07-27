import { ActionRowBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";
import ngrok from 'ngrok';

export default class NgrokListCommand extends DiscordCommandHandler {

  constructor() {
    super('ngroklistdebug', {
      name: 'ngroklistdebug',
      description: '(experimental) list info about active ngrok tunnels'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }

    const ngrokTunnels = await ngrok.getApi()?.listTunnels();

    if (!ngrokTunnels) {
      await interaction.reply({
        content: ':interrobang: Something went wrong while trying to list tunnels.'
      });
      return;
    }

    const ngrokTunnelJson = JSON.stringify(ngrokTunnels);

    await interaction.reply({
      content: `:satellite: Debug ngrok tunnel information (json): \`\`\`json\n${ngrokTunnelJson}\n\`\`\``
    });
  }

}