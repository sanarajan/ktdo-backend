export interface IDeleteDistrictAdminUseCase {
    execute(adminId: string): Promise<boolean>;
}
