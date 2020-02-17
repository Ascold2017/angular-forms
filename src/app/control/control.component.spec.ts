import { ControlComponent } from './control.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormField, FormService } from '../services/form.service';
import { By } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DebugElement } from '@angular/core';

describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlComponent ],
      imports: [ HttpClientModule ],
      providers: [ HttpClientModule, FormService ]
    });
    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.form = new FormGroup({
      test: new FormControl('', [])
    });
    component.field = {
      id: 1,
      isMultiple: false,
      isGroup: false,
      placeholder: 'Test placeholder',
      code: 'test',
      label: 'Test label',
      inputType: 'text',
      fields: [],
      initialValue: '',
      required: false,
      validators: []
    } as FormField;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display simple input without validation', async () => {
    component.form = new FormGroup({
      test: new FormControl('', [])
    });
    component.field = {
      id: 1,
      isMultiple: false,
      isGroup: false,
      placeholder: 'Test placeholder',
      code: 'test',
      label: 'Test label',
      inputType: 'text',
      fields: [],
      initialValue: '',
      required: false,
      validators: []
    } as FormField;
    component.pathToRootForm = [];
    fixture.detectChanges();
    const de = fixture.debugElement;
    const fieldsets: DebugElement[] = de.queryAll(By.css('fieldset'));
    expect(fieldsets.length).toBe(1);
    expect(de.query(By.css('input')).nativeElement.value).toBe('');
    expect(de.query(By.css('input')).nativeElement.type).toBe('text');
    expect(de.query(By.css('input')).nativeElement.placeholder).toContain('Test placeholder');
    expect(de.query(By.css('label')).nativeElement.textContent).toContain('Test label');
    expect(de.query(By.css('label')).nativeElement.textContent).not.toContain('*');
  });
  it('should display multiple input', () => {
    component.form = new FormGroup({
      test: new FormGroup({
        input: new FormControl('', []),
        values: new FormArray([])
      })
    });
    component.field = {
      id: 1,
      isMultiple: true,
      isGroup: false,
      placeholder: 'Test placeholder',
      code: 'test',
      label: 'Test label',
      inputType: 'text',
      fields: [],
      initialValue: '',
      required: false,
      validators: []
    } as FormField;
    component.pathToRootForm = [];
    fixture.detectChanges();
    const de = fixture.debugElement;
    const fieldsets: DebugElement[] = de.queryAll(By.css('fieldset'));
    expect(fieldsets.length).toBe(1);
    expect(de.query(By.css('input')).nativeElement.value).toBe('');
    expect(de.query(By.css('input')).nativeElement.type).toBe('text');
    expect(de.query(By.css('input')).nativeElement.placeholder).toContain('Test placeholder');
    expect(de.query(By.css('label')).nativeElement.textContent).toContain('Test label');
    expect(de.query(By.css('label')).nativeElement.textContent).not.toContain('*');
    expect(de.query(By.css('button[type=button]')).nativeElement).toBeDefined();
    expect(de.query(By.css('button[type=button]')).nativeElement.textContent).toContain('Add value');
    expect(de.query(By.css('ul')).nativeElement).toBeDefined();
    expect(de.queryAll(By.css('li')).length).toBe(0);
  });
});
