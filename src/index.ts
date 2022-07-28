import { REST } from '@discordjs/rest';
import { ChatInputCommandInteraction, Client, Interaction, InteractionType, ModalSubmitInteraction, Routes } from 'discord.js';
import fs from 'fs';
import ngrok from 'ngrok';
import NgrokKillCommand from './commands/ngrok/ngrokKill';
import NgrokListCommand from './commands/ngrok/ngrokList';
import NgrokServicesCommand from './commands/ngrok/ngrokServices';
import NgrokSetAuthTokenCommand from './commands/ngrok/ngrokSetAuthToken';
import NgrokStartCommand from './commands/ngrok/ngrokStart';
import NgrokStopCommand from './commands/ngrok/ngrokStop';
import NgrokStopAllCommand from './commands/ngrok/ngrokStopAll';
import PingCommand from './commands/ping';
import RestartCommand from './commands/restart';
import SourceCommand from './commands/source';
import UpdateCommand from './commands/update';
import UptimeCommand from './commands/uptime';
import NgrokStartModal from './modals/ngrokStart';
import NgrokStopModal from './modals/ngrokStop';
import DiscordCommandHandler from './types/command';
import JumpstarterConfiguration from './types/config';
import DiscordModalInteractionHandler from './types/modal';

const client = new Client({
  intents: []
});

let configuration: JumpstarterConfiguration = {
  token: 'none',
  appClientId: 'none',
  mainGuildId: 'none',
  authorizedUserIds: [],
  ngrok: {
    enabled: false,
    services: []
  },
  updateCommandEnabled: false,
  restartCommandEnabled: false
};

let commands: DiscordCommandHandler[] = [
  new PingCommand(),
  new NgrokKillCommand(),
  new NgrokListCommand(),
  new NgrokServicesCommand(),
  new NgrokSetAuthTokenCommand(),
  new NgrokStartCommand(),
  new NgrokStopAllCommand(),
  new NgrokStopCommand(),
  new RestartCommand(),
  new SourceCommand(),
  new UpdateCommand(),
  new UptimeCommand()
];

let modals: DiscordModalInteractionHandler[] = [
  new NgrokStartModal(),
  new NgrokStopModal()
];

// main function
(async () => {
  // load configuration
  if (!fs.existsSync('./config.json')) {
    console.error("config.json not found, try making a config using config.example.json as an example");
    return;
  }

  const fileConfigText = fs.readFileSync('./config.json', {
    encoding: 'utf8'
  }).toString();

  try {
    let fileConfigJson = JSON.parse(fileConfigText);
    configuration = fileConfigJson as JumpstarterConfiguration;
  } catch (ex) {
    console.error('failed to parse config.json file, please check for errors.');
  }
  
  // add commands to guild
  const commandData = commands.map(x=>x.getData())
  const rest = new REST({ version: '10' }).setToken(configuration.token);
  await rest.put(
    Routes.applicationGuildCommands(
      configuration.appClientId,
      configuration.mainGuildId
    ), { body: commandData }
  );
  
  // command interaction handler
  const handleCommandInteraction = async (interaction: ChatInputCommandInteraction) => {
    if (!configuration.authorizedUserIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: ':no_entry: You are not authorized to interact with this bot.'
      });
      return;
    }

    // only allow guild interactions. should never happen but just in case.
    if (!interaction.guildId || interaction.guildId !== configuration.mainGuildId) {
      await interaction.reply({
        content: ':no_entry: commands must be run in the main guild specified in the configuration.'
      });
      return;
    }

    for (const command of commands) {
      if (command.getName() === interaction.commandName) {
        try {
          await command.execute(interaction, configuration, client);
        } catch (ex) {
          console.error(ex);
          await interaction.reply({
            content: ':interrobang: An unknown error occurred while trying to do that, check the logs for more information.'
          });
        }
        return;
      }
    }

    await interaction.reply({
      content: ':question: Looks like that command couldn\'t be found for some reason.'
    });
  }

  // modal interaction handler
  const handleModalInteraction = async (interaction: ModalSubmitInteraction) => {
    if (!configuration.authorizedUserIds.includes(interaction.user.id)) {
      await interaction.reply({
        content: ':no_entry: You are not authorized to interact with this bot.'
      });
      return;
    }

    // only allow guild interactions. should never happen but just in case.
    if (!interaction.guildId || interaction.guildId !== configuration.mainGuildId) {
      await interaction.reply({
        content: ':no_entry: modals must be used in the main guild specified in the configuration.'
      });
      return;
    }

    for (const modal of modals) {
      if (modal.getId() === interaction.customId) {
        try {
          await modal.execute(interaction, configuration, client);
        } catch (ex) {
          console.error(ex);
          await interaction.reply({
            content: ':interrobang: An unknown error occurred while trying to do that, check the logs for more information.'
          });
        }
        return;
      }
    }

    await interaction.reply({
      content: ':question: Looks like that modal couldn\'t be found for some reason.'
    });
  }

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      handleCommandInteraction(interaction);
    } else if (interaction.type === InteractionType.ModalSubmit) {
      handleModalInteraction(interaction);
    }
  });
  
  if (configuration.ngrok.enabled) {
    // ensure ngrok agent is awake by opening a connection and closing it but not killing the agent
    let url = await ngrok.connect({
      bind_tls: false
    });
    await ngrok.disconnect(url);
  }

  await client.login(configuration.token);
  console.log('Running jumpstarter service');
})();