import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ResetCodeGuard {
	constructor(private readonly router: Router) {}

	canActivate() {
		if (this.router.getCurrentNavigation()?.extractedUrl.queryParamMap.has('code')) {
			return true;
		}

		this.router.navigate(['/auth/login']);
		return false;
	}
}
