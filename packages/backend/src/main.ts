/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap(module: string, port: number) {
  const _module = (await import('./services/' + module + '.module')).default as Function
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    _module,
    {
      transport: Transport.TCP,
      options: {
        port,
      },
    }
  )
  app.listen()
  Logger.log(`🚀 "${module}" Microservice running`)
}

const module = process.env.MICROSERVICE_MODULE || 'lobby'
const port = Number(process.env.MICROSERVICE_PORT || '3000')

bootstrap(module, port)
