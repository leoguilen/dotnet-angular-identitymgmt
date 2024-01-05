import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

@Injectable()
export class AuthGuard {
	constructor(private readonly router: Router, private readonly authService: AuthService) {}

	canActivate() {
		if (this.authService.accessToken) {
			if (this.authService.accessToken.expirationDate < new Date()) {
				this.authService.refreshAccessToken().subscribe({
					next: (response) => {
						this.authService.accessToken = response;
						return true;
					},
					error: () => {
						this.router.navigate(['/auth/login']);
						return false;
					},
				});
			}
			return true;
		}

		this.router.navigate(['/auth/login']);
		return false;
	}
}
