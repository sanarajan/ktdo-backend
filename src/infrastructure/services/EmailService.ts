import { injectable, inject } from 'tsyringe';
import nodemailer from 'nodemailer';
import { ILoggerService, IEmailService } from '../../application/services';

@injectable()
export class EmailService implements IEmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor(@inject('ILoggerService') private logger: ILoggerService) {
        this.initializeTransporter();
    }

    private initializeTransporter() {
        try {
            const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
            const smtpPort = parseInt(process.env.SMTP_PORT || '587');
            const smtpUser = process.env.SMTP_USER;
            const smtpPass = process.env.SMTP_PASS;

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

    async sendPasswordResetEmail(email: string, newPassword: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const mailOptions = {
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject: 'Password Reset Successful',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Password Reset Successful</h2>
                        <p>Your password has been successfully reset.</p>
                        <p>Your new password is: <strong>${newPassword}</strong></p>
                        <p>Please login with your new password.</p>
                        <br>
                        <p>Best regards,<br>KTDO Team</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.info(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error('Failed to send password reset email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async sendRegistrationPendingEmail(email: string, memberName: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const subject = 'Registration Pending Approval';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome, ${memberName}!</h2>
                    <p>Thank you for registering with KTDO (Karuna Taxi Driver Organization).</p>
                    <p>Your registration has been received and is currently pending approval from our administrators.</p>
                    <p>We will review your application and send you an approval email once it's processed.</p>
                    <p>This typically takes 1-3 business days.</p>
                    <br>
                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    <br>
                    <p>Best regards,<br>KTDO Team</p>
                </div>
            `;

            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject,
                html
            });

            this.logger.info('Registration pending email sent', { email });
        } catch (error) {
            this.logger.error('Failed to send registration pending email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async sendAdminMemberApprovedEmail(email: string, memberName: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const subject = 'Welcome to KTDO - Member Approved';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome, ${memberName}!</h2>
                    <p>Congratulations! You have been approved as a member of KTDO (Karuna Taxi Driver Organization).</p>
                    <p>Your ID card will be generated and delivered to you as soon as possible.</p>
                    <p>You can now access all member benefits and services.</p>
                    <br>
                    <p>If you have any questions, please contact us.</p>
                    <br>
                    <p>Best regards,<br>KTDO Team</p>
                </div>
            `;

            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject,
                html
            });

            this.logger.info('Admin member approved email sent', { email });
        } catch (error) {
            this.logger.error('Failed to send admin member approved email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async sendDistrictAdminCreatedEmail(email: string, adminName: string, workingState: string, workingDistrict: string, password: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email service not available');
            return;
        }

        try {
            const subject = 'You Are Appointed as District Admin - KTDO';
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Congratulations, ${adminName}!</h2>
                    <p>You have been appointed as a <strong>District Admin</strong> for KTDO (Karuna Taxi Driver Organization).</p>
                    <br>
                    <p><strong>Your Assignment:</strong></p>
                    <ul>
                        <li><strong>Working State:</strong> ${workingState}</li>
                        <li><strong>Working District:</strong> ${workingDistrict}</li>
                    </ul>
                    <br>
                    <p><strong>Login Credentials:</strong></p>
                    <ul>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                    </ul>
                    <br>
                    <p>You can now login to the admin dashboard and manage members in your district.</p>
                    <p><em>For security reasons, please change your password after your first login.</em></p>
                    <br>
                    <p>If you have any questions, please contact the main administrator.</p>
                    <br>
                    <p>Best regards,<br>KTDO Team</p>
                </div>
            `;

            await this.transporter.sendMail({
                from: process.env.FROM_EMAIL || process.env.SMTP_USER,
                to: email,
                subject,
                html
            });

            this.logger.info('District admin created email sent', { email });
        } catch (error) {
            this.logger.error('Failed to send district admin created email', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}
