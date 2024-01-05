import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
	loggedUser: {
		id: string;
		userName: string;
		email: string;
		phoneNumber?: string;
		initials: string;
	} | null = null;

	constructor(private readonly router: Router, private readonly authService: AuthService) {}

	ngOnInit(): void {
		this.authService.getMe().subscribe(({ id, email, userName, phoneNumber }) => {
			this.loggedUser = {
				id,
				email,
				userName: userName.split('@')[0],
				phoneNumber,
				initials: userName
					.split(' ')
					.map((n) => n[0].toUpperCase())
					.join(''),
			};
		});
	}

	onLogout() {
		this.authService.logout().subscribe(() => {
			this.authService.accessToken = null;
			this.router.navigate(['/auth/login']);
		});
	}
}
