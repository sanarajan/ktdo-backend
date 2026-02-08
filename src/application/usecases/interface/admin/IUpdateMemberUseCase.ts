import { User } from '../../../../domain/entities/User';

export interface UpdateMemberDTO {
  name?: string;
  email?: string;
  phone?: string;
  houseName?: string;
  place?: string;
  workingState?: string;
  workingDistrict?: string;
  state?: string;
  district?: string;
  pin?: string;
  bloodGroup?: string;
  licenceNumber?: string;
  stateCode?: string;
  rtoCode?: string;
  stateRtoCode?: string;
  deletePhoto?: boolean | string;
}

export interface IUpdateMemberUseCase {
  execute(memberId: string, updateData: UpdateMemberDTO, file?: Express.Multer.File): Promise<User>;
}
