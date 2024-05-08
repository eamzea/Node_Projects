import { envs } from '../../config';

export class DiscordService {
  private readonly discordWebhookUrl = envs.DISCORD_WEBHOOK_URL;

  constructor() {}

  async notify(message: string) {
    const body = {
      content: message,
      // embeds: [
      //   {
      //     image: {
      //       url: '',
      //     },
      //   },
      // ],
    };

    console.log(message, this.discordWebhookUrl)

    const response = await fetch(this.discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json()

    console.log(data);

    if (!response.ok) {
      console.log('Error sending message');
      return false;
    }

    return true;
  }
}
