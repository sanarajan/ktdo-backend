export interface DeleteResult {
    softDeleted: boolean;
}

export interface IDeleteMemberUseCase {
    execute(memberId: string): Promise<DeleteResult>;
}
