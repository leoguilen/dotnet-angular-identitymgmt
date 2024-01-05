import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	constructor(private readonly httpClient: HttpClient) {}

	public get<T>(
		url: string,
		options?: {
			headers?: HttpHeaders | { [header: string]: string | string[] };
			params?: HttpParams | { [param: string]: string | string[] };
			responseType?: 'json' | 'text';
		},
	): Observable<T> {
		if (options?.responseType === 'text') {
			return this.httpClient.get(`${environment.apiBaseUrl}${url}`, {
				...options,
				responseType: 'text',
			}) as Observable<T>;
		}

		return this.httpClient.get<T>(`${environment.apiBaseUrl}${url}`, {
			...options,
			responseType: 'json',
		}) as Observable<T>;
	}

	public post<T>(
		url: string,
		body: any,
		options?: {
			headers?: HttpHeaders | { [header: string]: string | string[] };
			params?: HttpParams | { [param: string]: string | string[] };
		},
	): Observable<T> {
		return this.httpClient.post<T>(
			`${environment.apiBaseUrl}${url}`,
			body,
			options,
		) as Observable<T>;
	}
}
