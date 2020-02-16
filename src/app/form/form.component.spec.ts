import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormService } from '../services/form.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [HttpClientModule],
      providers: [FormService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call formService.init on init', () => {
    const spy = spyOn(component.formService, 'init');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call formService.submit on submit', () => {
    const spy = spyOn(component.formService, 'submit');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
});
