import { Client, ModalSubmitInteraction } from "discord.js";
import JumpstarterConfiguration, { NgrokService } from "../types/config";
import DiscordModalInteractionHandler from "../types/modal";
import ngrok from 'ngrok';

export default class NgrokStartModal extends DiscordModalInteractionHandler {

  constructor() {
    super('ngrok-start');
  }

  async execute(interaction: ModalSubmitInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so you cannot submit this modal.'
      });
      return;
    }

    const serviceShortname = interaction.fields.getTextInputValue('service-shortname');

    if (!serviceShortname) {
      await interaction.reply({
        content: ':bangbang: You must provide a service name!'
      });
      return;
    }

    let targetedService: NgrokService|null = null;

    for (const service of config.ngrok.services) {
      if (service.shortname === serviceShortname) {
        targetedService = service;
        break;
      }
    }

    if (!targetedService) {
      await interaction.reply({
        content: ':interrobang: Couldn\'t find that service. Check your spelling and try again (*tip: make sure to use the shortname*). Use `/ngrokservices` for a list of available services.'
      });
      return;
    }

    const serviceUrl = await ngrok.connect({
      proto: targetedService.protocol,
      addr: targetedService.port,
      bind_tls: false
    });

    await interaction.reply({
      content: `:satellite_orbital: Started ngrok service **${targetedService.name}** on port **${targetedService.port}**, accessible from \`${serviceUrl}\``
    });

  }

}