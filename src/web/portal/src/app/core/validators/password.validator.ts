import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const value = control.value;

	if (!value) {
		return null;
	}

	const hasUpperCase = /[A-Z]+/.test(value);
	const hasLowerCase = /[a-z]+/.test(value);
	const hasNumeric = /[0-9]+/.test(value);
	const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

	const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacters;

	return !passwordValid ? { passwordStrength: true } : null;
};

export const passwordsMatchValidator: ValidatorFn = (
	control: AbstractControl,
): ValidationErrors | null => {
	const password = control.get('password');
	const passwordConfirm = control.get('passwordConfirm');

	if (!password || !passwordConfirm) {
		return null;
	}

	if (password.value !== passwordConfirm.value) {
		passwordConfirm.setErrors({ passwordMatch: true });
		return { passwordMatch: true };
	}

	return null;
};
