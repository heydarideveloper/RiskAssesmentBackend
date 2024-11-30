import { Module } from '@nestjs/common';
import { RiskAssessmentModule } from './risk-assessment/risk-assessment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RiskAssessmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
