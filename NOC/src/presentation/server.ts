import { CheckService } from "../domain/use-cases/checks/check"
import { CronService } from "./cron/cronJob"

export class Server {
  public static start() {
    console.log('Server started...')

    CronService.createJob(
      '*/5 * * * * *',
      () => {
        new CheckService(
          (msg) => console.log(msg),
          (error) => console.log(error)
        ).execute('https://google.com')
      }
    )
  }
}
