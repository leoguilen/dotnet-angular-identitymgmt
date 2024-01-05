import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let router: Router;
	let authService: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				{ provide: Router, useValue: {} },
				{
					provide: AuthService,
					useValue: { accessToken: null },
				},
			],
		});
		guard = TestBed.inject(AuthGuard);
		router = TestBed.inject(Router);
		authService = TestBed.inject(AuthService);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});
