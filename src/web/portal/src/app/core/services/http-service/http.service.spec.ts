import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
	let httpService: HttpService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [HttpService],
		});
		httpService = TestBed.inject(HttpService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(httpService).toBeTruthy();
	});

	it('should send a GET request', () => {
		const url = '/api/data';
		const responseData = { id: 1, name: 'Test' };

		httpService.get(url).subscribe((data) => {
			expect(data).toEqual(responseData);
		});

		const req = httpTestingController.expectOne('/api/data');
		expect(req.request.method).toBe('GET');
		req.flush(responseData);
	});

	it('should send a POST request', () => {
		const url = '/api/data';
		const requestData = { name: 'Test' };
		const responseData = { id: 1, name: 'Test' };

		httpService.post(url, requestData).subscribe((data) => {
			expect(data).toEqual(responseData);
		});

		const req = httpTestingController.expectOne('/api/data');
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual(requestData);
		req.flush(responseData);
	});
});
