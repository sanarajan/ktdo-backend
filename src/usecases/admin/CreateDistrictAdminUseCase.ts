import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { DistrictAdmin } from "../../domain/entities/DistrictAdmin";
import { UserRole, ApprovalStatus } from "../../common/enums";
import { ILogger, IStorageService } from "../../common/interfaces";
import bcrypt from "bcrypt";

@injectable()
export class CreateDistrictAdminUseCase {
  constructor(
    @inject("IUserRepository") private userRepo: IUserRepository,
    @inject("ILogger") private logger: ILogger,
    @inject("IStorageService") private storageService: IStorageService
  ) {}

  async execute(
    data: Partial<DistrictAdmin>,
    file?: Express.Multer.File
  ): Promise<DistrictAdmin> {
    const existing = await this.userRepo.findByEmail(data.email!);
    if (existing) throw new Error("Email already exists");

    // Check if phone number already exists
    const existingPhone = await this.userRepo.findByPhone(data.phone!);
    if (existingPhone) throw new Error("Phone number already exists");

    // Ensure only one district admin per district
    if (data.state && data.district) {
      const districtAdmins = await this.userRepo.findAllByRole(UserRole.DISTRICT_ADMIN);
      const conflict = (districtAdmins || []).find(da => da.state === data.state && da.district === data.district);
      if (conflict) {
        throw new Error('A District Admin already exists for this state/district');
      }
    }

    let photoUrl = "";
    if (file) {
    //   this.logger.info("Uploading admin photo");

      try {
        photoUrl = await this.storageService.uploadBuffer(
          file.buffer,
          file.mimetype,
          "ktdo"
        );
      } catch (error) {
        this.logger.error("Failed to upload admin photo", undefined, { error });
      }
    }

    const hashedPassword = await bcrypt.hash(data.password!, 10);

    const adminData: DistrictAdmin = {
      ...data,
      password: hashedPassword,
      role: UserRole.DISTRICT_ADMIN,
      status: ApprovalStatus.APPROVED, // District admins are immediately active
      photoUrl: photoUrl || undefined,
    } as DistrictAdmin;

    return (await this.userRepo.create(adminData)) as DistrictAdmin;
  }
}
