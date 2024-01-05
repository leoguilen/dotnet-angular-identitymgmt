import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationEmailComponent } from './confirmation-email.component';

describe('ConfirmationEmailComponent', () => {
	let component: ConfirmationEmailComponent;
	let fixture: ComponentFixture<ConfirmationEmailComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ConfirmationEmailComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmationEmailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
