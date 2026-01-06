import { User } from '../../../../domain/entities/User';

export interface IGetDistrictAdminsUseCase {
    execute(): Promise<(User & { deletable: boolean })[]>;
}
