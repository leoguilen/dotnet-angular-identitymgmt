import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
	selector: 'app-password-reset-request',
	templateUrl: './password-reset-request.component.html',
	styleUrl: './password-reset-request.component.scss',
})
export class PasswordResetRequestComponent {
	passwordResetRequestForm: FormGroup = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
	processingPasswordResetRequest: boolean = false;

	constructor(
		private readonly formBuilder: FormBuilder,
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
	) {}

	get email() {
		return this.passwordResetRequestForm.get('email');
	}

	onSubmit() {
		this.messageService.clear();

		if (this.passwordResetRequestForm.invalid) {
			return;
		}

		this.processingPasswordResetRequest = true;
		this.authService.resetPasswordRequest(this.email?.value).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Password reset request sent',
					detail: 'Check your email for a password reset link. Go back to <a href="/auth/login">Login page.</a>',
					closable: true,
				});
			},
			error: () => {
				this.messageService.add({
					severity: 'error',
					summary: 'Password reset request failed',
					detail: 'Something went wrong while processing your password reset request. Please try again later.',
					closable: true,
				});
				this.processingPasswordResetRequest = false;
			},
			complete: () => {
				this.processingPasswordResetRequest = false;
			},
		});
	}
}
