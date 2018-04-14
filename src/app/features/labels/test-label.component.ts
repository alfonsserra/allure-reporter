import { Component, Input } from '@angular/core';
import { Label } from '../../model/test-case.model';

@Component({
	selector:    'test-label',
	templateUrl: 'test-label.component.html'
})
export class TestLabelComponent {

	@Input() label: Label;

}
