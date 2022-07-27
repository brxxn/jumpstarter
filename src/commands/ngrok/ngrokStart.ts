import { ActionRowBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";

export default class NgrokStartCommand extends DiscordCommandHandler {

  constructor() {
    super('ngrokstart', {
      name: 'ngrokstart',
      description: 'Start an ngrok service'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }
    
    const modal = new ModalBuilder().setCustomId('ngrok-start').setTitle('Start an ngrok service');
    const component = new TextInputBuilder().setCustomId('service-shortname').setLabel('Service shortname (see /ngrokservices)').setPlaceholder('(example: ssh)').setRequired(true).setStyle(TextInputStyle.Short);
    const actionRow = new ActionRowBuilder().addComponents(component);
    // @ts-ignore-next-line
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  }

}