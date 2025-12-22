import 'reflect-metadata';
import { container } from 'tsyringe';
import { LoggerService } from './infrastructure/logger/Logger';
import { CloudStorageService } from './infrastructure/storage/CloudStorage';
import { MongoUserRepository } from './infrastructure/database/repositories/MongoUserRepository';
import { MongoDriverRepository } from './infrastructure/database/repositories/MongoDriverRepository';
import { JwtService } from './infrastructure/auth/JwtService';
import { RegisterDriverUseCase } from './usecases/auth/RegisterDriverUseCase';
import { LoginUserUseCase } from './usecases/auth/LoginUserUseCase';
import { CreateDistrictAdminUseCase } from './usecases/admin/CreateDistrictAdminUseCase';
import { ToggleBlockStatusUseCase } from './usecases/admin/ToggleBlockStatusUseCase';
import { GetDistrictAdminsUseCase } from './usecases/admin/GetDistrictAdminsUseCase';
import { GetMembersUseCase } from './usecases/admin/GetMembersUseCase';
import { AuthController } from './adapters/controllers/AuthController';
import { AdminController } from './adapters/controllers/AdminController';

// Register Infrastructure
container.register('ILogger', { useClass: LoggerService });
container.register('IStorageService', { useClass: CloudStorageService });
container.register(JwtService, { useClass: JwtService });

// Register Repositories
container.register('IUserRepository', { useClass: MongoUserRepository });
container.register('IDriverRepository', { useClass: MongoDriverRepository });

// Register UseCases
container.register(RegisterDriverUseCase, { useClass: RegisterDriverUseCase });
container.register(LoginUserUseCase, { useClass: LoginUserUseCase });
container.register(CreateDistrictAdminUseCase, { useClass: CreateDistrictAdminUseCase });
container.register(ToggleBlockStatusUseCase, { useClass: ToggleBlockStatusUseCase });
container.register(GetDistrictAdminsUseCase, { useClass: GetDistrictAdminsUseCase });
container.register(GetMembersUseCase, { useClass: GetMembersUseCase });

// Register Controllers
container.register(AuthController, { useClass: AuthController });
container.register(AdminController, { useClass: AdminController });

export { container };
