import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { ILoggerService, IStorageService } from '../../../../application/services';
import { AppError } from '../../../../domain/errors/AppError';
import { IUpdateMemberUseCase, UpdateMemberDTO } from '../../interface/admin/IUpdateMemberUseCase';

@injectable()
export class UpdateMemberUseCase implements IUpdateMemberUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('ILoggerService') private logger: ILoggerService,
    @inject('IStorageService') private storageService: IStorageService
  ) {}

  async execute(
    memberId: string,
    updateData: UpdateMemberDTO,
    file?: Express.Multer.File
  ): Promise<User> {
    const member = await this.userRepo.findById(memberId);
    if (!member) throw new Error('Member not found');

    if (updateData.email !== undefined && updateData.email !== member.email) {
      const existingEmail = await this.userRepo.findByEmail(updateData.email);
      if (existingEmail) throw new AppError('Email already exists', 400);
    }

    if (updateData.phone !== undefined && updateData.phone !== member.phone) {
      const existingPhone = await this.userRepo.findByPhone(updateData.phone);
      if (existingPhone) throw new AppError('Phone number already exists', 400);
    }

    if (updateData.name !== undefined) member.name = updateData.name;
    if (updateData.email !== undefined) member.email = updateData.email;
    if (updateData.phone !== undefined) member.phone = updateData.phone;
    if (updateData.houseName !== undefined) (member as any).houseName = updateData.houseName;
    if (updateData.place !== undefined) (member as any).place = updateData.place;
    if (updateData.state !== undefined) (member as any).state = updateData.state;
    if (updateData.district !== undefined) (member as any).district = updateData.district;
    if (updateData.pin !== undefined) (member as any).pin = updateData.pin;
    if (updateData.bloodGroup !== undefined) (member as any).bloodGroup = updateData.bloodGroup;
    if (updateData.stateCode !== undefined) (member as any).stateCode = updateData.stateCode;
    if (updateData.rtoCode !== undefined) (member as any).rtoCode = updateData.rtoCode;
    if (updateData.stateRtoCode !== undefined) (member as any).stateRtoCode = updateData.stateRtoCode;

    if (file) {
      try {
        const photoUrl = await this.storageService.uploadBuffer(file.buffer, file.mimetype, 'ktdo');
        member.photoUrl = photoUrl;
      } catch (error) {
        this.logger.error('Failed to upload member photo', undefined, { error });
      }
    }

    const updatedMember = await this.userRepo.update(memberId, member as Partial<User>);
    if (!updatedMember) throw new Error('Failed to update member');
    return updatedMember;
  }
}
