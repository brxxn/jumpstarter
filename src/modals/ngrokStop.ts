import { Client, ModalSubmitInteraction } from "discord.js";
import JumpstarterConfiguration, { NgrokService } from "../types/config";
import DiscordModalInteractionHandler from "../types/modal";
import ngrok from 'ngrok';

export default class NgrokStopModal extends DiscordModalInteractionHandler {

  constructor() {
    super('ngrok-stop');
  }

  async execute(interaction: ModalSubmitInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so you cannot submit this modal.'
      });
      return;
    }

    const url = interaction.fields.getTextInputValue('ngrok-url');

    if (!url) {
      await interaction.reply({
        content: ':bangbang: You must provide an ngrok service URL!'
      });
      return;
    }

    try {
      await ngrok.disconnect(url);
    } catch (ex) {
      console.error(ex);
      await interaction.reply({
        content: ':bangbang: Failed to stop the service! Check your spelling and try again!'
      })
      return;
    }

    await interaction.reply({
      content: `:satellite_orbital: Stopped service successfully.`
    });

  }

}