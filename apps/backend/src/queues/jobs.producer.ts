import { Queue } from 'bullmq';
import { connectionOptions, QUEUE_NAME } from './queue.config.js';
import logger from '../utils/logger.js';
import { isDevelopment } from '../config/environment.js';
import { handleGenerateInvoicePdf, handleSendNotification, handleCreditReferralPoints } from './jobs.worker.js';

let jobsQueue: Queue | null = null;

if (!isDevelopment) {
  try {
    jobsQueue = new Queue(QUEUE_NAME, {
      connection: connectionOptions,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000, // starting backoff delay 2 seconds
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    jobsQueue.on('error', (err) => {
      logger.error('BullMQ Queue Error:', { metadata: { error: err.message } });
    });
  } catch (err: any) {
    logger.error('Failed to initialize BullMQ Queue client', { metadata: { error: err.message } });
  }
} else {
  logger.info('BullMQ Queue disabled in development to save Redis limits.');
}

export class JobsProducer {
  /**
   * Queue PDF Generation job
   */
  static async queueInvoicePdf(orderId: string, customerEmail?: string, customerName?: string) {
    if (!jobsQueue) {
      logger.info(`[DEV MODE] Generating PDF invoice synchronously for order ${orderId}`);
      handleGenerateInvoicePdf(orderId, customerEmail, customerName).catch(err => logger.error('Failed sync PDF generation:', err));
      return;
    }
    logger.info(`Queueing PDF generation for order ${orderId}`);
    await jobsQueue.add('GENERATE_INVOICE_PDF', { orderId, customerEmail, customerName });
  }

  /**
   * Queue external notifications (Email, SMS, FCM push)
   */
  static async queueNotification(payload: {
    userId: string;
    email?: string;
    phone?: string;
    channels: ('EMAIL' | 'SMS' | 'PUSH')[];
    templates: {
      email?: { id: string; data: any };
      sms?: string;
      push?: { title: string; body: string };
    };
  }) {
    if (!jobsQueue) {
      logger.info(`[DEV MODE] Sending notification synchronously for ${payload.email || payload.userId}`);
      handleSendNotification(payload).catch(err => logger.error('Failed sync notification dispatch:', err));
      return;
    }
    logger.info(`Queueing notifications for ${payload.email || payload.userId}`);
    await jobsQueue.add('SEND_NOTIFICATION', payload);
  }

  /**
   * Queue loyalty points calculation and referral award
   */
  static async queueCreditReferralPoints(orderId: string, userId: string) {
    if (!jobsQueue) {
      logger.info(`[DEV MODE] Crediting points synchronously for order ${orderId}`);
      handleCreditReferralPoints(orderId, userId).catch(err => logger.error('Failed sync points credit:', err));
      return;
    }
    logger.info(`Queueing referral/loyalty point credit for order ${orderId}, user ${userId}`);
    await jobsQueue.add('CREDIT_REFERRAL_POINTS', { orderId, userId });
  }
}

export { jobsQueue };
export default JobsProducer;
