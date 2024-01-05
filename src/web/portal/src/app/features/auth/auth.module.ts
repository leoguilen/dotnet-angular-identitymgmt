import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { AuthRoutingModule } from './auth-routing.module';
import { ConfirmationEmailRequestComponent } from './confirmation-email-request/confirmation-email-request.component';
import { ConfirmationEmailComponent } from './confirmation-email/confirmation-email.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetRequestComponent } from './password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		DividerModule,
		ButtonModule,
		CardModule,
		PasswordModule,
		InputTextModule,
		MessagesModule,
		ToastModule,
		DialogModule,
		AuthRoutingModule,
		CommonModule,
	],
	exports: [],
	providers: [MessageService],
	declarations: [
		LoginComponent,
		RegisterComponent,
		PasswordResetRequestComponent,
		PasswordResetComponent,
		ConfirmationEmailRequestComponent,
		ConfirmationEmailComponent,
	],
})
export class AuthModule {}
