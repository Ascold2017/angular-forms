import { Component, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(public formService: FormService) { }

  ngOnInit(): void {
    this.formService.init();
  }

  onSubmit() {
    console.log(this.formService.form.value);
  }
}
