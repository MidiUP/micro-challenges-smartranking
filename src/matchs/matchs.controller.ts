import { MatchsService } from './matchs.service';
import { ackMessage, ackMessageError } from './../common/utils/ackMessages';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';

const ackErrors: string[] = [
  'E11000',
  'Cast to ObjectId failed for value',
  'Cannot read property',
];

@Controller('matchs')
export class MatchsController {
  constructor(private readonly matchsService: MatchsService) {}
  private readonly logger = new Logger(MatchsController.name);

  @EventPattern('create-match')
  async createMatch(@Payload() match: Match, @Ctx() context: RmqContext) {
    try {
      await this.matchsService.createMatch(match);
      await ackMessage(context);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      await ackMessageError(ackErrors, error, context);
    }
  }
}
