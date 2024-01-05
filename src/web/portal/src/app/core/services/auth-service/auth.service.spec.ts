import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let service: AuthService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AuthService],
		});
		service = TestBed.inject(AuthService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set and get access token', () => {
		const accessTokenResponse = {
			currentToken: 'access-token',
			refreshToken: 'refresh-token',
			expirationDate: new Date(),
		};

		service.accessToken = accessTokenResponse;

		expect(service.accessToken).toEqual(accessTokenResponse);
	});

	describe('login', () => {
		it('should send login request', () => {
			const email = 'test@email.com';
			const password = 'password';

			service.login(email, password).subscribe();

			const req = httpMock.expectOne('/accounts/login');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({ email, password });
			req.flush({});
		});
	});

	describe('logout', () => {
		it('should throw an error when no access token is found', () => {
			service.accessToken = null;
			expect(() => service.logout()).toThrowError('No access token found');
		});

		it('should send logout request', () => {
			service.logout();

			const req = httpMock.expectOne('/accounts/logout');
			expect(req.request.method).toBe('POST');
			req.flush({});
		});
	});

	describe('register', () => {
		it('should send register request', () => {
			const email = 'test@email.com';
			const password = 'password';

			service.register(email, password).subscribe();

			const req = httpMock.expectOne('/accounts/register');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({ email, password });
			req.flush({});
		});
	});
});
