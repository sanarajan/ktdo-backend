// Centralized status codes for consistent API responses
export const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

export const SuccessMessage = {
    // Auth
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',

    // Users / Admins
    DISTRICT_ADMIN_CREATED: 'District Admin created successfully',
    USER_BLOCKED: 'User blocked successfully',
    USER_UNBLOCKED: 'User unblocked successfully',
    DISTRICT_ADMINS_RETRIEVED: 'District Admins retrieved successfully',
    DISTRICT_ADMIN_DELETED: 'District admin deleted successfully',

    // Members
    MEMBER_ADDED: 'Member added successfully',
    MEMBERS_RETRIEVED: 'Members retrieved successfully',
    MEMBER_UPDATED: 'Member updated successfully',
    MEMBER_STATUS_UPDATED: 'Member status updated',
    PRINT_COUNT_RECORDED: 'Print count recorded',
    MEMBER_SOFT_DELETED: 'Member soft-deleted after print',
    MEMBER_DELETED: 'Member permanently deleted',

    // Locations
    STATES_RETRIEVED: 'States retrieved successfully',
    DISTRICTS_RETRIEVED: 'Districts retrieved successfully',
    STATE_CODES_RETRIEVED: 'State codes retrieved',
} as const;

export const ErrorMessage = {
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_BLOCKED: 'Your account has been blocked. Please contact admin.',
    NOT_AUTHORIZED: 'Not authorized',
    INVALID_TOKEN: 'Invalid token',
    FORBIDDEN: 'Forbidden',
    USER_NOT_FOUND: 'User not found',
    USER_NO_LONGER_EXISTS: 'User account no longer exists. Please login again.',
    INVALID_ACTION: 'Invalid action',
    DELETE_DISTRICT_ADMIN_FAILED: 'Failed to delete district admin',
    MEMBER_NOT_FOUND: 'Member not found',
    INVALID_CURRENT_PASSWORD: 'Invalid current password',
} as const;

export const ValidationMessage = {
    REQUIRED_FIELDS: 'All required fields must be provided',
    PASSWORD_MISMATCH: 'Passwords do not match',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
} as const;
