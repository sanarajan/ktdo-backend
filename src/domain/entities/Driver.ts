import { User } from './User';
import { ApprovalStatus } from '../../common/enums';

export interface Driver extends User {
    districtAdminId: string;
    status: ApprovalStatus;
    rejectionReason?: string; // Reason for rejection if status is REJECTED
    uniqueId?: string; // Generated after approval
    printCount?: number; // Track number of times ID card was printed
    photoUrl?: string;
    // Registration details
    bloodGroup?: string;
    licenceNumber?: string;
    pin?: string;
    stateCode?: string;
    rtoCode?: string;
    stateRtoCode?: string;
}
