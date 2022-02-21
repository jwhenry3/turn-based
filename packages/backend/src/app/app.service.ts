import * as Nest from '@nestjs/common'
import Injectable = Nest.Injectable

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to backend!' }
  }
}
