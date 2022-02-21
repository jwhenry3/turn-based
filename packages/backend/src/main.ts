/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as NestCommon from '@nestjs/common'
import * as NestCore from '@nestjs/core'
import NestFactory = NestCore.NestFactory
import Logger = NestCommon.Logger

import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
