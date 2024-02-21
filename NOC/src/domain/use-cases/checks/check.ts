interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (success:string) => void
type ErrorCallback = (error: string) => void

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {

  }

  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);

      if (!req.ok) {
        throw new Error(`Error checking service ${url}`)
      }

      console.log(`Service: ${url} is ok`)

      this.successCallback(`Service: ${url} is ok`)

      return req.ok
    } catch (error) {
      console.log(error)
      this.errorCallback(`${error} is down`)
      return false
    }
  }
}
