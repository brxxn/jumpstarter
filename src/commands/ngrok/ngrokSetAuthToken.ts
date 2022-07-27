import { ChatInputCommandInteraction, Client } from "discord.js";
import DiscordCommandHandler from "../../types/command";
import JumpstarterConfiguration from "../../types/config";
import ngrok from 'ngrok';

export default class NgrokSetAuthTokenCommand extends DiscordCommandHandler {

  constructor() {
    super('ngroksetauthtoken', {
      name: 'ngroksetauthtoken',
      description: 'Update the auth token for ngrok to use',
      options: [
        {
          type: 3,
          name: 'token',
          description: 'the ngrok token you want to use',
          required: true
        }
      ]
    });
  }

  async execute(interaction: ChatInputCommandInteraction, config: JumpstarterConfiguration, client: Client) {
    if (!config.ngrok.enabled) {
      await interaction.reply({
        content: ':bangbang: ngrok is not enabled in this environment, so this command cannot be used.'
      });
      return;
    }
    
    const token = interaction.options.getString('token');

    if (!token) {
      await interaction.reply({
        content: ':bangbang: You must provide a token to use this command.'
      });
      return;
    }

    await ngrok.authtoken(token);
    await interaction.reply({
      content: ':key: Authentication token for ngrok successfully updated.'
    });
  }

}