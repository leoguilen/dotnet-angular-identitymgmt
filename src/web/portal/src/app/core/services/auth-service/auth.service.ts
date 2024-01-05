import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../interfaces/requests/login-request.interface';
import { RegisterRequest } from '../../interfaces/requests/register-request.interface';
import { ResetPasswordRequest } from '../../interfaces/requests/reset-password-request.interface';
import { AccessTokenResponse } from '../../interfaces/responses/access-token-response.interface';
import { UserResponse } from '../../interfaces/responses/user-response.interface';
import { HttpService } from '../http-service/http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
	constructor(
		private readonly httpService: HttpService,
		@Inject('LOCALSTORAGE') private readonly storage: Storage,
	) {}

	get accessToken(): {
		currentToken: string;
		refreshToken: string;
		expirationDate: Date;
	} | null {
		const accessTokenValue = this.storage.getItem('accessToken');
		if (!accessTokenValue) {
			return null;
		}

		const accessTokenJsonValue = JSON.parse(accessTokenValue);

		return {
			currentToken: accessTokenJsonValue.currentToken,
			refreshToken: accessTokenJsonValue.refreshToken,
			expirationDate: new Date(accessTokenJsonValue.expirationDate),
		};
	}

	set accessToken(response: AccessTokenResponse | null) {
		if (response) {
			const expirationDate = new Date();
			expirationDate.setSeconds(Number.parseInt(response.expiresIn!));

			this.storage.setItem(
				'accessToken',
				JSON.stringify({
					currentToken: response.accessToken,
					refreshToken: response.refreshToken,
					expirationDate: expirationDate.toISOString(),
				}),
			);
		} else {
			this.storage.removeItem('accessToken');
		}
	}

	login(email: string, password: string): Observable<AccessTokenResponse> {
		const requestBody: LoginRequest = {
			email,
			password,
		};
		return this.httpService.post<AccessTokenResponse>('/accounts/login', requestBody, {
			params: {
				useCookies: 'false',
				useSessionCookies: 'false',
			},
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Connection: 'keep-alive',
			},
		});
	}

	logout(): Observable<void> {
		const accessToken = this.accessToken?.currentToken;
		if (!accessToken) {
			throw new Error('No access token found');
		}

		return this.httpService.post<void>('/accounts/logout', null, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		});
	}

	refreshAccessToken(): Observable<AccessTokenResponse> {
		const refreshToken = this.accessToken?.refreshToken;
		if (!refreshToken) {
			throw new Error('No refresh token found');
		}

		return this.httpService.post<AccessTokenResponse>(
			'/accounts/refresh',
			{
				refreshToken,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		);
	}

	register(email: string, password: string): Observable<void> {
		const requestBody: RegisterRequest = {
			email,
			password,
		};
		return this.httpService.post<void>('/accounts/register', requestBody, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}

	resendConfirmationEmail(email: string): Observable<void> {
		return this.httpService.post<void>(
			'/accounts/resendConfirmationEmail',
			{ email },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		);
	}

	confirmEmail(userId: string, code: string): Observable<string> {
		return this.httpService.get<string>('/accounts/confirmEmail', {
			params: {
				userId,
				code,
			},
			headers: {
				Accept: 'text/plain',
			},
			responseType: 'text',
		});
	}

	resetPasswordRequest(email: string): Observable<void> {
		return this.httpService.post<void>(
			'/accounts/forgotPassword',
			{ email },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			},
		);
	}

	resetPassword(email: string, resetCode: string, newPassword: string): Observable<void> {
		const requestBody: ResetPasswordRequest = {
			email,
			resetCode,
			newPassword,
		};
		return this.httpService.post<void>('/accounts/resetPassword', requestBody, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}

	getMe(): Observable<UserResponse> {
		const accessToken = this.accessToken?.currentToken;
		if (!accessToken) {
			throw new Error('No access token found');
		}

		return this.httpService.get<UserResponse>('/accounts/me', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
			responseType: 'json',
		});
	}
}
