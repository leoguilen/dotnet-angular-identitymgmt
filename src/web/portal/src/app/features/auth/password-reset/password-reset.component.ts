import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import {
	passwordStrengthValidator,
	passwordsMatchValidator,
} from '../../../core/validators/password.validator';

@Component({
	selector: 'app-password-reset',
	templateUrl: './password-reset.component.html',
	styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent implements OnInit {
	passwordResetForm: FormGroup = this.fb.group(
		{
			code: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: [
				'',
				[Validators.required, Validators.minLength(8), passwordStrengthValidator],
			],
			passwordConfirm: ['', [Validators.required]],
		},
		{
			validators: [passwordsMatchValidator],
		},
	);
	processingPasswordResetRequest: boolean = false;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly fb: FormBuilder,
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
	) {}

	get email() {
		return this.passwordResetForm.get('email');
	}

	get password() {
		return this.passwordResetForm.get('password');
	}

	get passwordConfirm() {
		return this.passwordResetForm.get('passwordConfirm');
	}

	ngOnInit(): void {
		this.route.queryParamMap.subscribe((paramsMap) => {
			this.passwordResetForm.patchValue({
				code: paramsMap.get('code') ?? '',
			});
		});
	}

	onSubmit() {
		this.messageService.clear();

		if (this.passwordResetForm.invalid) {
			return;
		}

		this.processingPasswordResetRequest = true;
		this.authService
			.resetPassword(
				this.email?.value,
				this.passwordResetForm.get('code')?.value,
				this.password?.value,
			)
			.subscribe({
				next: () => {
					this.messageService.add({
						severity: 'success',
						summary: 'Password reset successful',
						life: 2800,
					});
				},
				error: (error) => {
					switch (error.status) {
						case 400:
							this.messageService.add({
								severity: 'error',
								summary: 'Password reset failed',
								detail: 'The password reset code is invalid or has expired. Please request a new one <a href="/auth/password-reset-request">here</a>.',
								closable: true,
							});
							break;
						default:
							this.messageService.add({
								severity: 'error',
								summary: 'Password reset failed',
								detail: 'Something went wrong while resetting your password. Please try again.',
								closable: true,
							});
							break;
					}
					this.processingPasswordResetRequest = false;
				},
				complete: () => {
					this.passwordResetForm.reset();
					this.processingPasswordResetRequest = false;
					setTimeout(() => {
						this.router.navigate(['/auth/login']);
					}, 3000);
				},
			});
	}
}
