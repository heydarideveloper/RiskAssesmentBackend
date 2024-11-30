import { Injectable, Logger } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';
import { CustomerDto } from '../dto/customer.dto';

export enum NotificationType {
  RISK_LEVEL_CHANGE = 'RISK_LEVEL_CHANGE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DOCUMENT_EXPIRY = 'DOCUMENT_EXPIRY',
  REVIEW_REQUIRED = 'REVIEW_REQUIRED',
  COMPLIANCE_ALERT = 'COMPLIANCE_ALERT',
}

export interface Notification {
  id: string;
  type: NotificationType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  customerId: number;
  message: string;
  metadata: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private notifications: Map<string, Notification> = new Map();

  async createNotification(
    type: NotificationType,
    customer: CustomerDto,
    message: string,
    metadata: Record<string, any> = {},
  ): Promise<Notification> {
    try {
      const notification: Notification = {
        id: this.generateNotificationId(),
        type,
        severity: this.determineSeverity(type, customer.riskLevel),
        customerId: customer.id,
        message,
        metadata,
        createdAt: new Date(),
      };

      this.notifications.set(notification.id, notification);
      await this.logNotificationCreation(notification);

      return notification;
    } catch (error) {
      this.logger.error('Error creating notification', error.stack);
      throw error;
    }
  }

  async acknowledgeNotification(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = this.notifications.get(notificationId);
    if (!notification) {
      throw new Error(`Notification ${notificationId} not found`);
    }

    const acknowledgedNotification = {
      ...notification,
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
    };

    this.notifications.set(notificationId, acknowledgedNotification);
    return acknowledgedNotification;
  }

  async getCustomerNotifications(
    customerId: number,
    includeAcknowledged = false,
  ): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.customerId === customerId)
      .filter(
        (notification) => includeAcknowledged || !notification.acknowledgedAt,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private generateNotificationId(): string {
    return `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(
    type: NotificationType,
    customerRiskLevel: RiskLevel,
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    switch (type) {
      case NotificationType.SUSPICIOUS_ACTIVITY:
        return 'HIGH';
      case NotificationType.RISK_LEVEL_CHANGE:
        return customerRiskLevel === RiskLevel.HIGH ? 'HIGH' : 'MEDIUM';
      case NotificationType.DOCUMENT_EXPIRY:
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  private async logNotificationCreation(
    notification: Notification,
  ): Promise<void> {
    this.logger.log(
      `Created ${notification.type} notification for customer ${notification.customerId}`,
    );
  }
}
