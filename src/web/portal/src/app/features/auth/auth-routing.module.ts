import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetCodeGuard } from '../../core/guards/reset-code.guard';
import { ConfirmationEmailRequestComponent } from './confirmation-email-request/confirmation-email-request.component';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{ path: 'login', title: 'Login', component: LoginComponent },
	{ path: 'register', title: 'Register', component: RegisterComponent },
	{
		path: 'password-reset-request',
		title: 'Password Reset Request',
		component: PasswordResetRequestComponent,
	},
	{
		path: 'confirmation-email-request',
		title: 'Confirmation Email Request',
		component: ConfirmationEmailRequestComponent,
	},
	{
		path: 'confirmation-email',
		title: 'Confirmation Email',
		component: ConfirmationEmailComponent,
		canActivate: [ResetCodeGuard],
	},
	{
		path: 'password-reset',
		title: 'Password Reset',
		component: PasswordResetComponent,
		canActivate: [ResetCodeGuard],
	},
	{ path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
