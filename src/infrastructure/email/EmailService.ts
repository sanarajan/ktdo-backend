import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import { ILogger } from '../../common/interfaces';
import { inject } from 'tsyringe';

@injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor(@inject('ILogger') private logger: ILogger) {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        try {
            // Configure based on environment
            const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
            const smtpPort = parseInt(process.env.SMTP_PORT || '587');
            const smtpUser = process.env.SMTP_USER;
            const smtpPass = process.env.SMTP_PASS;
            const fromEmail = process.env.FROM_EMAIL || smtpUser;

            if (!smtpUser || !smtpPass) {
                this.logger.warn('Email service not configured - emails will not be sent');
                return;
            }

            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass
                }
            });

            this.logger.info('Email service initialized');
        } catch (error) {
            this.logger.error('Failed to initialize email service', error instanceof Error ? error.message : String(error));
        }
    }

    async sendApprovalEmail(email: string, memberName: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const subject = 'Your Registration Has Been Approved';
            const html = `
                <h2>Welcome, ${memberName}!</h2>
                <p>We are pleased to inform you that your registration has been approved.</p>
                <p>Your ID card will be generated and provided to you soon.</p>
                <p>If you have any questions, please contact us.</p>
                <br>
                <p>Best regards,<br>KTDO Team</p>
            `;

            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject,
                html
            });

            this.logger.info('Approval email sent', { email });
        } catch (error) {
            this.logger.error('Failed to send approval email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async sendRejectionEmail(email: string, memberName: string, reason?: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const subject = 'Your Registration Status';
            const html = `
                <h2>Hello ${memberName},</h2>
                <p>We regret to inform you that your registration has been rejected.</p>
                ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
                <p>If you believe this is an error or would like to reapply, please contact us.</p>
                <br>
                <p>Best regards,<br>KTDO Team</p>
            `;

            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject,
                html
            });

            this.logger.info('Rejection email sent', { email });
        } catch (error) {
            this.logger.error('Failed to send rejection email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}
