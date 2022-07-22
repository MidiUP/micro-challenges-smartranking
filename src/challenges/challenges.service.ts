import { ClientProxyConnections } from './../rabbit-mq/client-proxy-connections';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment-timezone';
import { Model } from 'mongoose';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);
  private readonly clientNotificationBackend: ClientProxy;

  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly clientProxyConnections: ClientProxyConnections,
  ) {
    this.clientNotificationBackend =
      this.clientProxyConnections.connectQueueNotifications();
  }

  async createChallenge(createChallengeDto: Challenge) {
    try {
      const challengeCreated = new this.challengeModel({
        ...createChallengeDto,
        dateHourRequest: new Date(),
        status: ChallengeStatus.PENDING,
      });

      await challengeCreated.save();

      this.clientNotificationBackend.emit(
        'notification-new-challenge',
        challengeCreated,
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallenges(): Promise<Challenge[]> {
    try {
      return await this.challengeModel
        .find()
        // .populate(['players', 'match'])
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallengesByUser(idPlayer: string): Promise<Challenge[]> {
    try {
      return await this.challengeModel
        .find({})
        .where('players')
        .in([idPlayer])
        // .populate(['players', 'match'])
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallengeById(_id: string): Promise<Challenge> {
    try {
      return await this.challengeModel
        .findOne({ _id })
        // .populate(['players', 'match'])
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallengesCompletedByDate(
    idCategory: string,
    dateRef: any,
  ): Promise<Challenge[]> {
    try {
      const dateRefNew = `${dateRef} 23:59:59.999`;
      const challenges = await this.challengeModel
        .find({
          dateHourChallenge: {
            $lte: moment(dateRefNew)
              .tz('UTC')
              .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
          },
        })
        .where('category')
        .equals(idCategory)
        .where('status')
        .equals(ChallengeStatus.COMPLETED)
        .where('dateHourChallenge')
        .exec();

      return challenges;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async getChallengesCompleted(idCategory: string): Promise<Challenge[]> {
    try {
      const challenges = await this.challengeModel
        .find({ category: idCategory, status: ChallengeStatus.COMPLETED })
        .exec();

      return challenges;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(
    idChallenge: string,
    updateChallengeDto: Challenge,
  ): Promise<Challenge> {
    try {
      const challenge = { ...updateChallengeDto, dateHourResponse: new Date() };
      return await this.challengeModel
        .findOneAndUpdate({ _id: idChallenge }, { $set: challenge })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deleteChallenge(_id: string): Promise<void> {
    try {
      await this.challengeModel
        .findOneAndUpdate(
          { _id },
          { $set: { status: ChallengeStatus.CANCELLED } },
        )
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  // async addMatchChallenge(
  //   _id: string,
  //   attributeMatchChallengeDto: AttributeMatchChallengeDto,
  // ) {
  //   const match = {
  //     ...attributeMatchChallengeDto,
  //   };

  //   const matchCreated = await this.matchsService.createMatch(match);

  //   await this.challengeModel
  //     .findByIdAndUpdate(
  //       { _id },
  //       {
  //         $set: { status: ChallengeStatus.COMPLETED, match: matchCreated._id },
  //       },
  //     )
  //     .exec();
  // }
}
