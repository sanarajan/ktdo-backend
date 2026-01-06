import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { DistrictAdmin } from '../../../../domain/entities/DistrictAdmin';
import { UserRole, ApprovalStatus } from '../../../../common/enums';
import { ILoggerService, IStorageService, IHashService } from '../../../../application/services';
import { ICreateDistrictAdminUseCase } from '../../interface/admin/ICreateDistrictAdminUseCase';

@injectable()
export class CreateDistrictAdminUseCase implements ICreateDistrictAdminUseCase {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('ILoggerService') private logger: ILoggerService,
    @inject('IStorageService') private storageService: IStorageService,
    @inject('IHashService') private hashService: IHashService,
    @inject('IEmailService') private emailService: any
  ) {}

  async execute(
    data: Partial<DistrictAdmin>,
    file?: Express.Multer.File
  ): Promise<DistrictAdmin> {
    const existing = await this.userRepo.findByEmail(data.email!);
    if (existing) throw new Error('Email already exists');

    // Check if phone number already exists
    const existingPhone = await this.userRepo.findByPhone(data.phone!);
    if (existingPhone) throw new Error('Phone number already exists');

    // Ensure only one district admin per district
    if (data.state && data.district) {
      const districtAdmins = await this.userRepo.findAllByRole(UserRole.DISTRICT_ADMIN);
      const conflict = (districtAdmins || []).find(da => da.state === data.state && da.district === data.district);
      if (conflict) {
        throw new Error('A District Admin already exists for this state/district');
      }
    }

    let photoUrl = '';
    if (file) {
    //   this.logger.info("Uploading admin photo");

      try {
        photoUrl = await this.storageService.uploadBuffer(
          file.buffer,
          file.mimetype,
          'ktdo'
        );
      } catch (error) {
        this.logger.error('Failed to upload admin photo', undefined, { error });
      }
    }

    const hashedPassword = await this.hashService.hash(data.password!);

    const adminData: DistrictAdmin = {
      ...data,
      password: hashedPassword,
      role: UserRole.DISTRICT_ADMIN,
      status: ApprovalStatus.APPROVED, // District admins are immediately active
      photoUrl: photoUrl || undefined,
    } as DistrictAdmin;

    const result = (await this.userRepo.create(adminData)) as DistrictAdmin;

    // Send district admin creation email (non-blocking)
    try {
      await this.emailService.sendDistrictAdminCreatedEmail(
        data.email!,
        data.name!,
        data.state!,
        data.district!,
        data.password! // Send the plain text password
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn('Failed to send district admin creation email', message);
      // Don't throw - email failure shouldn't prevent admin creation
    }

    return result;
  }
}
