import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
	selector: 'app-confirmation-email-request',
	templateUrl: './confirmation-email-request.component.html',
	styleUrl: './confirmation-email-request.component.scss',
})
export class ConfirmationEmailRequestComponent {
	confirmationEmailRequestForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
	});
	processingconfirmationEmailRequest: boolean = false;

	constructor(
		private readonly fb: FormBuilder,
		private readonly authService: AuthService,
		private readonly messageService: MessageService,
	) {}

	get email() {
		return this.confirmationEmailRequestForm.get('email');
	}

	onSubmit() {
		this.messageService.clear();

		if (this.confirmationEmailRequestForm.invalid) {
			return;
		}

		this.processingconfirmationEmailRequest = true;
		this.authService.resendConfirmationEmail(this.email!.value).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Confirmation email link sent',
					detail: 'Check your email for a confirmation email link. Go back to <a href="/auth/login">Login page.</a>',
					closable: true,
				});
				this.confirmationEmailRequestForm.reset();
				this.processingconfirmationEmailRequest = false;
			},
			error: () => {
				this.messageService.add({
					severity: 'error',
					summary: 'Send confirmation email failed',
					detail: 'Something went wrong while processing your confirmation email request. Please try again later.',
					closable: true,
				});
				this.processingconfirmationEmailRequest = false;
			},
		});
	}
}
