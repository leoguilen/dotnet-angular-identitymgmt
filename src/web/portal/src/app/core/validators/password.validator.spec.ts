import { FormControl, FormGroup } from '@angular/forms';
import { passwordStrengthValidator, passwordsMatchValidator } from './password.validator';

describe('passwordStrengthValidator', () => {
	it('should return null if the password is strong', () => {
		const control = new FormControl('Abc123!@#');
		const result = passwordStrengthValidator(control);
		expect(result).toBeNull();
	});

	it('should return an error object if the password is weak', () => {
		const control = new FormControl('weakpassword');
		const result = passwordStrengthValidator(control);
		expect(result).toEqual({ passwordStrength: true });
	});

	it('should return null if the password is empty', () => {
		const control = new FormControl('');
		const result = passwordStrengthValidator(control);
		expect(result).toBeNull();
	});
});

describe('passwordsMatchValidator', () => {
	it('should return null if the passwords match', () => {
		const form = new FormGroup({
			password: new FormControl('Abc123!@#'),
			passwordConfirm: new FormControl('Abc123!@#'),
		});
		const result = passwordsMatchValidator(form);
		expect(result).toBeNull();
	});

	it('should return an error object if the passwords do not match', () => {
		const form = new FormGroup({
			password: new FormControl('Abc123!@#'),
			passwordConfirm: new FormControl('DifferentPassword'),
		});
		const result = passwordsMatchValidator(form);
		expect(result).toEqual({ passwordMatch: true });
	});

	it('should return null if either password or passwordConfirm is missing', () => {
		const form1 = new FormGroup({
			password: new FormControl('Abc123!@#'),
		});
		const result1 = passwordsMatchValidator(form1);
		expect(result1).toBeNull();

		const form2 = new FormGroup({
			passwordConfirm: new FormControl('Abc123!@#'),
		});
		const result2 = passwordsMatchValidator(form2);
		expect(result2).toBeNull();
	});
});
