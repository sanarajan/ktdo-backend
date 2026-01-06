import { Driver } from '../../../../domain/entities/Driver';
import { ApprovalStatus } from '../../../../common/enums';

export interface IApproveMemberUseCase {
    execute(memberId: string, action: ApprovalStatus.APPROVED | ApprovalStatus.REJECTED, reason?: string): Promise<Driver>;
}
