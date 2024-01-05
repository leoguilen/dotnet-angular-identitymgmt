import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
	});
	processingLoginRequest: boolean = false;

	constructor(
		private readonly router: Router,
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
		private readonly fb: FormBuilder,
	) {}

	ngOnInit(): void {
		if (this.authService.accessToken) {
			this.router.navigate(['/home']);
		}

		this.loginForm.reset();
	}

	get email() {
		return this.loginForm.get('email');
	}

	get password() {
		return this.loginForm.get('password');
	}

	onSubmit() {
		this.messageService.clear();

		if (this.loginForm.invalid) {
			return;
		}

		this.processingLoginRequest = true;
		this.authService
			.login(this.email?.value, this.password?.value)
			.subscribe({
				next: (response) => {
					this.messageService.add({
						severity: 'success',
						summary: 'Login successful',
						detail: 'Redirecting to home',
						life: 2800,
					});
					this.authService.accessToken = response;
				},
				error: (error) => {
					switch (error.status) {
						case 401:
							switch (error.error.detail) {
								case 'Failed':
									this.messageService.add({
										severity: 'error',
										summary: 'Login failed',
										detail: 'Invalid credentials. Check your email and password',
										closable: true,
									});
									break;
								case 'NotAllowed':
									this.messageService.add({
										severity: 'error',
										summary: 'Login failed',
										detail: 'Account is not allowed to login.</br>Please check your email for verification link or request for a new one <a href="/auth/confirmation-email-request">here</a>',
										closable: true,
									});
									break;
								case 'LockedOut':
									this.messageService.add({
										severity: 'error',
										summary: 'Login failed',
										detail: 'Account is locked out. Please wait for a few minutes before trying again',
										closable: true,
									});
									break;
								default:
									this.messageService.add({
										severity: 'error',
										summary: 'Login failed',
										detail: 'Login failed. Please try again later',
										closable: true,
									});
									break;
							}
							break;
						default:
							this.messageService.add({
								severity: 'error',
								summary: 'Login failed',
								detail: 'Something went wrong. Please try again later',
								closable: true,
							});
							break;
					}
				},
				complete: () => {
					setTimeout(() => {
						this.router.navigate(['/home']);
					}, 3000);
				},
			})
			.add(() => {
				this.loginForm.reset();
				this.processingLoginRequest = false;
			});
	}
}
