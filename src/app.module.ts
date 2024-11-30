import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RiskAssessmentModule } from './risk-assessment/risk-assessment.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [RiskAssessmentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
