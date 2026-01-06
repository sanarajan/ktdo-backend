import { User } from '../../../../domain/entities/User';

export interface UpdateMemberDTO {
  name?: string;
  email?: string;
  phone?: string;
  houseName?: string;
  place?: string;
  state?: string;
  district?: string;
  pin?: string;
  bloodGroup?: string;
  stateCode?: string;
  rtoCode?: string;
  stateRtoCode?: string;
}

export interface IUpdateMemberUseCase {
    execute(memberId: string, updateData: UpdateMemberDTO, file?: Express.Multer.File): Promise<User>;
}
