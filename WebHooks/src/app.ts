import express from 'express';
import { envs } from './config';
import { GitHubController } from './presentation';
import { GitHubSha256Middleware } from './presentation/middlewares';

(() => {
  main()
})()

function main() {
  const app = express();
  const controller = new GitHubController()

  app.use(express.json())
  app.use(GitHubSha256Middleware.verifySignature)

  app.post('/api/github', controller.webHookHandler)

  app.listen(envs.PORT, () => {
    console.log(`App running on port: ${envs.PORT}`)
  })
}
