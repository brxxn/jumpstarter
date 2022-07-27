import { ActionRowBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";

export default class NgrokServicesCommand extends DiscordCommandHandler {

  constructor() {
    super('ngrokservices', {
      name: 'ngrokservices',
      description: 'List ngrok services that the bot can control'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }

    await interaction.reply({
      content: 'Listing all configured ngrok services:',
      embeds: [{
        color: 0x03fcb6,
        title: 'Available ngrok services',
        description: 'Below is a list of all ngrok services that can be started by this bot',
        fields: config.ngrok.services.map(service => {
          return {
            name: service.name,
            value: `shortname: \`${service.shortname}\`\nport: \`${service.port}\`\nprotocol: \`${service.protocol}\``,
            inline: true
          }
        })
      }]
    });
  }

}