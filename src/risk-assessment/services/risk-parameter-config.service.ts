import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';

export enum RiskParameterCategory {
  CUSTOMER = 'CUSTOMER',
  GEOGRAPHIC = 'GEOGRAPHIC',
  TRANSACTION = 'TRANSACTION',
  PRODUCT = 'PRODUCT',
  DELIVERY = 'DELIVERY',
}

export interface RiskParameter {
  id: string;
  name: string;
  category: RiskParameterCategory;
  weight: number;
  thresholds: {
    [RiskLevel.LOW]: number;
    [RiskLevel.MEDIUM]: number;
    [RiskLevel.HIGH]: number;
  };
  active: boolean;
  lastUpdated: Date;
  updatedBy?: string;
  description?: string;
}

@Injectable()
export class RiskParameterConfigService {
  private readonly logger = new Logger(RiskParameterConfigService.name);
  private parameters: Map<string, RiskParameter> = new Map();

  async getParameter(id: string): Promise<RiskParameter> {
    try {
      const parameter = this.parameters.get(id);
      if (!parameter) {
        throw new NotFoundException(`Risk parameter ${id} not found`);
      }
      return parameter;
    } catch (error) {
      this.logger.error(`Error fetching parameter ${id}`, error.stack);
      throw error;
    }
  }

  async updateParameter(
    id: string,
    updates: Partial<RiskParameter>,
    updatedBy: string,
  ): Promise<RiskParameter> {
    try {
      const parameter = await this.getParameter(id);

      // Validate weight
      if (
        updates.weight !== undefined &&
        (updates.weight < 0 || updates.weight > 1)
      ) {
        throw new BadRequestException('Weight must be between 0 and 1');
      }

      // Validate thresholds
      if (updates.thresholds) {
        this.validateThresholds(updates.thresholds);
      }

      const updatedParameter = {
        ...parameter,
        ...updates,
        lastUpdated: new Date(),
        updatedBy,
      };

      this.parameters.set(id, updatedParameter);
      await this.logParameterUpdate(id, updatedBy);

      return updatedParameter;
    } catch (error) {
      this.logger.error(`Error updating parameter ${id}`, error.stack);
      throw error;
    }
  }

  async listParameters(
    category?: RiskParameterCategory,
  ): Promise<RiskParameter[]> {
    try {
      let parameters = Array.from(this.parameters.values());

      if (category) {
        parameters = parameters.filter((param) => param.category === category);
      }

      return parameters.filter((param) => param.active);
    } catch (error) {
      this.logger.error('Error listing parameters', error.stack);
      throw error;
    }
  }

  async validateParameters(parameters: RiskParameter[]): Promise<boolean> {
    try {
      // Group parameters by category
      const categoryGroups = new Map<RiskParameterCategory, RiskParameter[]>();

      for (const param of parameters) {
        const categoryParams = categoryGroups.get(param.category) || [];
        categoryParams.push(param);
        categoryGroups.set(param.category, categoryParams);
      }

      // Validate weights sum up to 1 for each category
      for (const [category, params] of categoryGroups) {
        const totalWeight = params.reduce(
          (sum, param) => sum + param.weight,
          0,
        );
        if (Math.abs(totalWeight - 1) > 0.0001) {
          throw new BadRequestException(
            `Weights for category ${category} must sum to 1`,
          );
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error validating parameters', error.stack);
      throw error;
    }
  }

  private validateThresholds(thresholds: RiskParameter['thresholds']): void {
    if (
      thresholds[RiskLevel.LOW] >= thresholds[RiskLevel.MEDIUM] ||
      thresholds[RiskLevel.MEDIUM] >= thresholds[RiskLevel.HIGH]
    ) {
      throw new BadRequestException(
        'Thresholds must be in ascending order: LOW < MEDIUM < HIGH',
      );
    }
  }

  private async logParameterUpdate(
    id: string,
    updatedBy: string,
  ): Promise<void> {
    this.logger.log(`Parameter ${id} updated by ${updatedBy}`);
  }
}
