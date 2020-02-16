import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField, FormService } from '../services/form.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent {

  @Input() form: FormGroup;
  @Input() field: FormField;
  @Input() pathToRootForm: string[] = []; // [form_group_1, form_group_1_1, ...]

  constructor(private formService: FormService) { }

  addValue() {
   this.formService.pushValueInSingleMultipleField(this.field.code, this.pathToRootForm);
  }
}
