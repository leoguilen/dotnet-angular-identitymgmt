import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import {
	passwordStrengthValidator,
	passwordsMatchValidator,
} from '../../../core/validators/password.validator';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent {
	registerForm: FormGroup = this.fb.group(
		{
			email: ['', [Validators.required, Validators.email]],
			password: [
				'',
				[Validators.required, Validators.minLength(8), passwordStrengthValidator],
			],
			passwordConfirm: ['', [Validators.required]],
		},
		{ validator: passwordsMatchValidator },
	);
	processingRegisterRequest: boolean = false;
	isDialogVisible: boolean = false;

	constructor(
		private readonly fb: FormBuilder,
		private readonly messageService: MessageService,
		private readonly authService: AuthService,
		private readonly router: Router,
	) {}

	get email() {
		return this.registerForm.get('email');
	}

	get password() {
		return this.registerForm.get('password');
	}

	get passwordConfirm() {
		return this.registerForm.get('passwordConfirm');
	}

	onSubmit() {
		this.messageService.clear();

		if (this.registerForm.invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Invalid form',
				detail: 'Please check the form for errors.',
				closable: true,
				life: 5000,
			});

			this.registerForm.markAllAsTouched();
			return;
		}

		this.processingRegisterRequest = true;
		this.authService
			.register(this.email!.value, this.password!.value)
			.subscribe({
				next: () => {
					this.isDialogVisible = true;
				},
				error: (error) => {
					console.error(error);
					switch (error.status) {
						case 400:
							if (error.error.errors?.['DuplicateEmail']) {
								this.messageService.add({
									severity: 'error',
									summary: 'Registration failed',
									detail: 'The email address you provided is already in use.',
									closable: true,
								});

								this.email?.setErrors({ duplicateEmail: true });
							}
							return;
						default:
							this.messageService.add({
								severity: 'error',
								summary: 'Registration failed',
								detail:
									error.error.title ??
									error.error.detail ??
									'An unknown error occurred. Please try again later.',
								closable: true,
							});
							break;
					}
				},
			})
			.add(() => {
				this.registerForm.reset();
				this.processingRegisterRequest = false;
			});
	}

	onClickOk() {
		this.isDialogVisible = false;
		this.router.navigate(['/auth/login']);
	}
}
