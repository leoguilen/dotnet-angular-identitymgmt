export interface ResetPasswordRequest {
	email: string;
	resetCode: string;
	newPassword: string;
}
