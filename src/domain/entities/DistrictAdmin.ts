import { User } from './User';

export interface DistrictAdmin extends User {
    state: string;
    district: string;
}
