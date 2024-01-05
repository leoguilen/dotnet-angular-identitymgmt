import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResetCodeGuard } from './reset-code.guard';

describe('ResetCodeGuard', () => {
	let guard: ResetCodeGuard;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ResetCodeGuard, { provide: Router, useValue: {} }],
		});
		guard = TestBed.inject(ResetCodeGuard);
		router = TestBed.inject(Router);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});
});
