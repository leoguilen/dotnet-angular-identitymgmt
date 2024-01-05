import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';

@Component({
	selector: 'app-confirmation-email',
	templateUrl: './confirmation-email.component.html',
	styleUrl: './confirmation-email.component.scss',
})
export class ConfirmationEmailComponent implements OnInit {
	confirmed: boolean = false;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly authService: AuthService,
	) {}

	ngOnInit(): void {
		this.route.queryParamMap.subscribe((params) => {
			const userId = params.get('userId');
			const code = params.get('code');

			if (!userId || !code) {
				return;
			}

			this.authService.confirmEmail(userId, code).subscribe({
				next: () => {
					this.confirmed = true;
				},
				error: (error) => {
					console.log(error);
					this.confirmed = false;
				},
			});
		});
	}
}
