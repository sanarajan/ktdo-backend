export interface IEmailService {
    sendApprovalEmail(email: string, memberName: string): Promise<void>;
    sendRejectionEmail(email: string, memberName: string, reason?: string): Promise<void>;
    sendPasswordResetEmail(email: string, newPassword: string): Promise<void>;
    sendRegistrationPendingEmail(email: string, memberName: string): Promise<void>;
    sendAdminMemberApprovedEmail(email: string, memberName: string): Promise<void>;
    sendDistrictAdminCreatedEmail(email: string, adminName: string, workingState: string, workingDistrict: string, password: string): Promise<void>;
}
