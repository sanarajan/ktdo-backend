import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import bcrypt from "bcrypt";
import { ILogger, IStorageService } from "../../common/interfaces";

export interface UpdateMemberDTO {
  name?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  vehicleNumber?: string;
  address?: string;
  state?: string;
  district?: string;
  post?: string;
  pin?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  password?: string;
}

@injectable()
export class UpdateMemberUseCase {
  constructor(
    @inject("IUserRepository") private userRepo: IUserRepository,
    @inject("ILogger") private logger: ILogger,
    @inject("IStorageService") private storageService: IStorageService
  ) {}

  async execute(
    memberId: string,
    updateData: UpdateMemberDTO,
    file?: Express.Multer.File
  ): Promise<User> {
    const member = await this.userRepo.findById(memberId);

    if (!member) {
      throw new Error("Member not found");
    }

    // Update only provided fields
    // Update only provided fields
    if (updateData.name !== undefined) member.name = updateData.name;
    if (updateData.email !== undefined) member.email = updateData.email;
    if (updateData.phone !== undefined) member.phone = updateData.phone;
    if (updateData.licenseNumber !== undefined)
      member.licenseNumber = updateData.licenseNumber;
    if (updateData.vehicleNumber !== undefined)
      member.vehicleNumber = updateData.vehicleNumber;
    if (updateData.address !== undefined) member.address = updateData.address;
    if (updateData.state !== undefined)
      (member as any).state = updateData.state;
    if (updateData.district !== undefined)
      (member as any).district = updateData.district;
    if (updateData.post !== undefined) (member as any).post = updateData.post;
    if (updateData.pin !== undefined) (member as any).pin = updateData.pin;
    if (updateData.bloodGroup !== undefined)
      (member as any).bloodGroup = updateData.bloodGroup;
    if (updateData.emergencyContact !== undefined)
      (member as any).emergencyContact = updateData.emergencyContact;

    if (updateData.password) {
      member.password = await bcrypt.hash(updateData.password, 10);
    }

    let photoUrl = "";

    if (file) {
      try {
        photoUrl = await this.storageService.uploadBuffer(
          file.buffer,
          file.mimetype,
          "ktdo"
        );
        console.log(photoUrl,"phoytourl for update mener")
        member.photoUrl = photoUrl;
        console.log(  member.photoUrl , "photo url usecase for member update");
      } catch (error) {
        this.logger.error("Failed to upload driver photo", undefined, {
          error,
        });
      }
    }

    const updatedMember = await this.userRepo.update(memberId, member);
    if (!updatedMember) {
      throw new Error("Failed to update member");
    }
    return updatedMember;
  }
}
