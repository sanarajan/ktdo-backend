import 'reflect-metadata';
import { container } from 'tsyringe';
import { LoggerService } from './infrastructure/logger/Logger';
import { CloudStorageService } from './infrastructure/storage/CloudStorage';
import { MongoUserRepository } from './infrastructure/database/repositories/MongoUserRepository';
import { MongoDriverRepository } from './infrastructure/database/repositories/MongoDriverRepository';
import { JwtService } from './infrastructure/auth/JwtService';
import { EmailService } from './infrastructure/email/EmailService';
import { RegisterDriverUseCase } from './usecases/auth/RegisterDriverUseCase';
import { LoginUserUseCase } from './usecases/auth/LoginUserUseCase';
import { CreateDistrictAdminUseCase } from './usecases/admin/CreateDistrictAdminUseCase';
import { ToggleBlockStatusUseCase } from './usecases/admin/ToggleBlockStatusUseCase';
import { GetDistrictAdminsUseCase } from './usecases/admin/GetDistrictAdminsUseCase';
import { DeleteDistrictAdminUseCase } from './usecases/admin/DeleteDistrictAdminUseCase';
import { GetMembersUseCase } from './usecases/admin/GetMembersUseCase';
import { ApproveMemberUseCase } from './usecases/admin/ApproveMemberUseCase';
import { RecordPrintIdUseCase } from './usecases/admin/RecordPrintIdUseCase';
import { DeleteMemberUseCase } from './usecases/admin/DeleteMemberUseCase';
import { AuthController } from './adapters/controllers/AuthController';
import { AdminController } from './adapters/controllers/AdminController';

// Register Infrastructure
container.register('ILogger', { useClass: LoggerService });
container.register('IStorageService', { useClass: CloudStorageService });
container.register(JwtService, { useClass: JwtService });
container.register(EmailService, { useClass: EmailService });

// Register Repositories
container.register('IUserRepository', { useClass: MongoUserRepository });
container.register('IDriverRepository', { useClass: MongoDriverRepository });

// Register UseCases
container.register(RegisterDriverUseCase, { useClass: RegisterDriverUseCase });
container.register(LoginUserUseCase, { useClass: LoginUserUseCase });
container.register(CreateDistrictAdminUseCase, { useClass: CreateDistrictAdminUseCase });
container.register(ToggleBlockStatusUseCase, { useClass: ToggleBlockStatusUseCase });
container.register(GetDistrictAdminsUseCase, { useClass: GetDistrictAdminsUseCase });
container.register(DeleteDistrictAdminUseCase, { useClass: DeleteDistrictAdminUseCase });
container.register(GetMembersUseCase, { useClass: GetMembersUseCase });
container.register(ApproveMemberUseCase, { useClass: ApproveMemberUseCase });
container.register(RecordPrintIdUseCase, { useClass: RecordPrintIdUseCase });
container.register(DeleteMemberUseCase, { useClass: DeleteMemberUseCase });

// Register Controllers
container.register(AuthController, { useClass: AuthController });
container.register(AdminController, { useClass: AdminController });

export { container };
