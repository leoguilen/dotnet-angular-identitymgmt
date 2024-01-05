import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationEmailRequestComponent } from './confirmation-email-request.component';

describe('ConfirmationEmailRequestComponent', () => {
	let component: ConfirmationEmailRequestComponent;
	let fixture: ComponentFixture<ConfirmationEmailRequestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmationEmailRequestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationEmailRequestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
