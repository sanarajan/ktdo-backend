import { User } from './User';

export interface DistrictAdmin extends User {
    workingState: string;
    workingDistrict: string;
}
