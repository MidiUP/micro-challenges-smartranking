import { RabbitMqModule } from './../rabbit-mq/rabbit-mq.module';
import { ChallengesModule } from './../challenges/challenges.module';
import { MatchSchema } from './interfaces/match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';

@Module({
  providers: [MatchsService],
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
    ChallengesModule,
    RabbitMqModule,
  ],
  controllers: [MatchsController],
})
export class MatchsModule {}
