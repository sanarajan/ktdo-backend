import { inject, injectable } from 'tsyringe';
import { IDriverRepository } from '../../domain/repositories/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { ApprovalStatus } from '../../common/enums';
import { ILogger } from '../../common/interfaces';
import { EmailService } from '../../infrastructure/email/EmailService';

@injectable()
export class ApproveMemberUseCase {
    constructor(
        @inject('IDriverRepository') private driverRepo: IDriverRepository,
        @inject('ILogger') private logger: ILogger,
        @inject(EmailService) private emailService?: EmailService
    ) {}

    async execute(memberId: string, action: ApprovalStatus.APPROVED | ApprovalStatus.REJECTED, reason?: string): Promise<Driver> {
        const member = await this.driverRepo.findById(memberId);
        if (!member) {
            throw new Error('Member not found');
        }

        // Only members can be approved/rejected
        const updates: Partial<Driver> = { status: action };
        
        // Store rejection reason if provided
        if (action === ApprovalStatus.REJECTED && reason) {
            updates.rejectionReason = reason;
        } else if (action === ApprovalStatus.APPROVED) {
            // Clear rejection reason when approving
            updates.rejectionReason = undefined;
        }

        if (action === ApprovalStatus.APPROVED) {
            // Assign uniqueId if missing
            if (!(member as any).uniqueId) {
                const nextId = await this.driverRepo.getNextUniqueId();
                updates.uniqueId = nextId;
            }
        }

        const updated = await this.driverRepo.update(memberId, updates as Partial<Driver>);
        if (!updated) {
            throw new Error('Failed to update member status');
        }

        // Send email notification
        try {
            if (this.emailService) {
                if (action === ApprovalStatus.APPROVED) {
                    await this.emailService.sendApprovalEmail(member.email, member.name || 'Member');
                } else if (action === ApprovalStatus.REJECTED) {
                    await this.emailService.sendRejectionEmail(member.email, member.name || 'Member', reason);
                }
            }
        } catch (emailError) {
            this.logger.error('Failed to send notification email', emailError instanceof Error ? emailError.message : String(emailError));
            // Continue anyway - the status was updated successfully
        }

        this.logger.info('Member status updated', { memberId, status: updates.status, uniqueId: updates.uniqueId, reason });
        return updated as Driver;
    }
}
