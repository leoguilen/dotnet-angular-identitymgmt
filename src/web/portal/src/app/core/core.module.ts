import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AuthGuard } from './guards/auth.guard';
import { ResetCodeGuard } from './guards/reset-code.guard';
import { AuthService } from './services/auth-service/auth.service';
import { GlobalErrorHandler } from './services/global-error.handler';
import { HttpService } from './services/http-service/http.service';

@NgModule({
	imports: [CommonModule, HttpClientModule],
	declarations: [],
	providers: [
		AuthGuard,
		ResetCodeGuard,
		{
			provide: HttpService,
			useClass: HttpService,
		},
		{
			provide: AuthService,
			useClass: AuthService,
		},
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler,
		},
		{ provide: NGXLogger, useClass: NGXLogger },
		{ provide: 'LOCALSTORAGE', useValue: window.localStorage },
		{ provide: 'SESSIONSTORAGE', useValue: window.sessionStorage },
	],
	exports: [],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(
				`CoreModule has already been loaded. Import Core modules in the AppModule only.`,
			);
		}
	}
}
