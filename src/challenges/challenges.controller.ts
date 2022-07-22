import { ackMessage, ackMessageError } from './../common/utils/ackMessages';
import { ChallengesService } from './challenges.service';
import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000', 'Cast to ObjectId failed for value'];

@Controller()
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}
  private readonly logger = new Logger(ChallengesController.name);

  @EventPattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.challengesService.createChallenge(challenge);
      await ackMessage(context);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      await ackMessageError(ackErrors, error, context);
    }
  }

  @MessagePattern('get-challenges')
  async getChallenges(@Ctx() context: RmqContext) {
    try {
      return await this.challengesService.getChallenges();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
    } finally {
      await ackMessage(context);
    }
  }

  @MessagePattern('get-challenges-by-player')
  async getChallengesByPlayer(
    @Ctx() context: RmqContext,
    @Payload() idPlayer: string,
  ) {
    try {
      return this.challengesService.getChallengesByUser(idPlayer);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
    } finally {
      await ackMessage(context);
    }
  }

  @MessagePattern('get-challenge-by-id')
  async getChallengesById(@Ctx() context: RmqContext, @Payload() id: string) {
    try {
      return this.challengesService.getChallengeById(id);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
    } finally {
      await ackMessage(context);
    }
  }

  @MessagePattern('get-challenges-completed-by-date')
  async getChallengesCompletedByDate(
    @Ctx() context: RmqContext,
    @Payload() data: any,
  ) {
    try {
      const { idCategory, dataRef } = data;
      if (dataRef) {
        return this.challengesService.getChallengesCompletedByDate(
          idCategory,
          dataRef,
        );
      }

      return this.challengesService.getChallengesCompleted(idCategory);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
    } finally {
      await ackMessage(context);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(
    @Ctx() context: RmqContext,
    @Payload() challengeUpdate: any,
  ) {
    try {
      const { id, challenge } = challengeUpdate;
      await this.challengesService.updateChallenge(id, challenge);
      await ackMessage(context);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      await ackMessageError(ackErrors, error, context);
    }
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(@Ctx() context: RmqContext, @Payload() id: string) {
    try {
      await this.challengesService.deleteChallenge(id);
      await ackMessage(context);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      await ackMessageError(ackErrors, error, context);
    }
  }
}
