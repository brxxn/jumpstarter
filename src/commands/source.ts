import { ChatInputCommandInteraction, Client } from 'discord.js';
import DiscordCommandHandler from '../types/command';
import JumpstarterConfiguration from '../types/config';

export default class SourceCommand extends DiscordCommandHandler {

  constructor() {
    super('source', {
      name: 'source',
      description: 'Get a link to the source'
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    await interaction.reply({
      content: `:books: The source is located at https://github.com/brxxn/jumpstarter`
    });
  }

}