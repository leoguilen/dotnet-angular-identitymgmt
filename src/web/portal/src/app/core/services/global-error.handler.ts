import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	constructor(private injector: Injector) {}

	handleError(error: Error): void {
		const logger = this.injector.get(NGXLogger);
		logger.error('Global error handler caught an error.', error);
		throw error;
	}
}
