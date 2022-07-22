import { ChallengeSchema } from './interfaces/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService],
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    RabbitMqModule,
  ],
  exports: [ChallengesService],
})
export class ChallengesModule {}
