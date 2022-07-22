import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ChallengesModule } from './challenges/challenges.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchsModule } from './matchs/matchs.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ChallengesModule,
    RabbitMqModule,
    MatchsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
