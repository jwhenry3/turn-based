import * as Nest from '@nestjs/common'
import Controller = Nest.Controller
import Get = Nest.Get

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData()
  }
}
