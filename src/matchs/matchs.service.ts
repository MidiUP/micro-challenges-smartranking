import { ClientProxyConnections } from './../rabbit-mq/client-proxy-connections';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { ChallengesService } from './../challenges/challenges.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './interfaces/match.interface';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { ChallengeStatus } from 'src/challenges/interfaces/challenge-status.enum';

@Injectable()
export class MatchsService {
  private readonly clientRankingsBackend: ClientProxy;

  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly challengesService: ChallengesService,
    private readonly clientProxyConnections: ClientProxyConnections,
  ) {
    this.clientRankingsBackend =
      this.clientProxyConnections.connectQueueRankings();
  }

  private readonly logger = new Logger(MatchsService.name);

  async createMatch(match: Match) {
    try {
      const matchCreated = await new this.matchModel(match).save();
      this.logger.log(`match created: ${JSON.stringify(matchCreated)}`);
      const idMatch = matchCreated._id;

      const challenge: Challenge =
        await this.challengesService.getChallengeById(matchCreated.challenge);

      challenge.match = idMatch;
      challenge.status = ChallengeStatus.COMPLETED;

      await this.challengesService.updateChallenge(challenge._id, challenge);

      this.clientRankingsBackend.emit('process-match', matchCreated);

      return challenge;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
