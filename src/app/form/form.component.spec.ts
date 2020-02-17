import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormService } from '../services/form.service';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlComponent } from '../control/control.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let formService: FormService;
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ FormComponent, ControlComponent ],
      imports: [HttpClientModule, FormsModule, ReactiveFormsModule ],
      providers: [ FormService ]
    });
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    formService = TestBed.get(FormService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call formService.init on init', () => {
    const spy = spyOn(formService, 'init');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call formService.submit on submit', async () => {
    const spy = spyOn(formService, 'submit');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
});
