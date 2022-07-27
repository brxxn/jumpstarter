import { ActionRowBuilder, ChatInputCommandInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";

export default class NgrokStopCommand extends DiscordCommandHandler {

  constructor() {
    super('ngrokstop', {
      name: 'ngrokstop',
      description: 'Stop an ngrok service'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }
    
    const modal = new ModalBuilder().setCustomId('ngrok-stop').setTitle('Stop an ngrok service');
    const component = new TextInputBuilder().setCustomId('ngrok-url').setLabel('Ngrok URL').setPlaceholder('tcp://0.tcp.ngrok.io:12345').setRequired(true).setStyle(TextInputStyle.Short);
    const actionRow = new ActionRowBuilder().addComponents(component);
    // @ts-ignore-next-line
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  }

}