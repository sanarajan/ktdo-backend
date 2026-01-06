import { container } from 'tsyringe';
import { RegisterDriverUseCase } from '../../application/usecases/implementation/auth/RegisterDriverUseCase';
import { LoginUserUseCase } from '../../application/usecases/implementation/auth/LoginUserUseCase';
import { ResetPasswordUseCase } from '../../application/usecases/implementation/auth/ResetPasswordUseCase';
import { CreateDistrictAdminUseCase } from '../../application/usecases/implementation/admin/CreateDistrictAdminUseCase';
import { ToggleBlockStatusUseCase } from '../../application/usecases/implementation/admin/ToggleBlockStatusUseCase';
import { GetDistrictAdminsUseCase } from '../../application/usecases/implementation/admin/GetDistrictAdminsUseCase';
import { DeleteDistrictAdminUseCase } from '../../application/usecases/implementation/admin/DeleteDistrictAdminUseCase';
import { GetMembersUseCase } from '../../application/usecases/implementation/admin/GetMembersUseCase';
import { ApproveMemberUseCase } from '../../application/usecases/implementation/admin/ApproveMemberUseCase';
import { RecordPrintIdUseCase } from '../../application/usecases/implementation/admin/RecordPrintIdUseCase';
import { DeleteMemberUseCase } from '../../application/usecases/implementation/admin/DeleteMemberUseCase';
import { AddMemberUseCase } from '../../application/usecases/implementation/admin/AddMemberUseCase';
import { UpdateMemberUseCase } from '../../application/usecases/implementation/admin/UpdateMemberUseCase';
import { GetLocationsUseCase } from '../../application/usecases/implementation/location/GetLocationsUseCase';

// Register Auth UseCases
container.register('IRegisterDriverUseCase', { useClass: RegisterDriverUseCase });
container.register('ILoginUserUseCase', { useClass: LoginUserUseCase });
container.register('IResetPasswordUseCase', { useClass: ResetPasswordUseCase });

// Register Admin UseCases
container.register('ICreateDistrictAdminUseCase', { useClass: CreateDistrictAdminUseCase });
container.register('IToggleBlockStatusUseCase', { useClass: ToggleBlockStatusUseCase });
container.register('IAddMemberUseCase', { useClass: AddMemberUseCase });
container.register('IGetDistrictAdminsUseCase', { useClass: GetDistrictAdminsUseCase });
container.register('IDeleteDistrictAdminUseCase', { useClass: DeleteDistrictAdminUseCase });
container.register('IGetMembersUseCase', { useClass: GetMembersUseCase });
container.register('IUpdateMemberUseCase', { useClass: UpdateMemberUseCase });
container.register('IApproveMemberUseCase', { useClass: ApproveMemberUseCase });
container.register('IRecordPrintIdUseCase', { useClass: RecordPrintIdUseCase });
container.register('IDeleteMemberUseCase', { useClass: DeleteMemberUseCase });

// Register Location UseCases
container.register('IGetLocationsUseCase', { useClass: GetLocationsUseCase });
