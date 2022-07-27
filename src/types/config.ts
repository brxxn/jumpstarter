export interface NgrokService {
  shortname: string;
  name: string;
  port: number;
  protocol: 'tcp'|'http'|'tls'
}

export interface NgrokConfiguration {
  services: NgrokService[];
  enabled: boolean;
}

export default interface JumpstarterConfiguration {
  token: string;
  mainGuildId: string;
  appClientId: string;
  authorizedUserIds: string[];
  ngrok: NgrokConfiguration;
  updateCommandEnabled: boolean;
  restartCommandEnabled: boolean;
}