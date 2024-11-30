import { Injectable } from '@nestjs/common';

export interface SanctionedEntity {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'LEGAL_ENTITY';
  reason: string;
  dateAdded: Date;
  source: string;
}

@Injectable()
export class SanctionsListService {
  private sanctionedEntities: SanctionedEntity[] = [];

  async checkSanctions(
    name: string,
    type: 'INDIVIDUAL' | 'LEGAL_ENTITY',
  ): Promise<SanctionedEntity | null> {
    // In real implementation, this would check against a database
    return (
      this.sanctionedEntities.find(
        (entity) =>
          entity.name.toLowerCase() === name.toLowerCase() &&
          entity.type === type,
      ) || null
    );
  }

  async addToSanctionsList(
    entity: Omit<SanctionedEntity, 'id' | 'dateAdded'>,
  ): Promise<SanctionedEntity> {
    const newEntity: SanctionedEntity = {
      ...entity,
      id: Date.now().toString(),
      dateAdded: new Date(),
    };
    this.sanctionedEntities.push(newEntity);
    return newEntity;
  }
}
