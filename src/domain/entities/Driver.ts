import { User } from './User';
import { ApprovalStatus } from '../../common/enums';

export interface Driver extends User {
    districtAdminId: string;
    licenseNumber: string;
    vehicleNumber: string;
    status: ApprovalStatus;
    uniqueId?: string; // Generated after approval
    photoUrl?: string;
}
