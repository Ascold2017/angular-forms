import { TestBed } from '@angular/core/testing';

import { FormService, FormField, FormFieldsFromResponse, FormFieldParamsFromResponse } from './form.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';

describe('FormService', () => {
  let service: FormService;
  const httpResponse = {
    data: [
      {
        id: 1,
        type: 'form_field',
        attributes: {
          is_multiple: false,
          code: 'test_code',
          name: 'Test'
        },
        relationships: {
          form_attribute_type: {
            data: {
              id: 1,
              attributes: {
                code: 'text'
              },
              type: 'form_field_type'
            }
          }
        }
      }
    ]
  } as FormFieldsFromResponse;

  const expectFields = [
    {
      id: 1,
      isMultiple: false,
      isGroup: false,
      placeholder: '',
      code: 'test_code',
      label: 'Test',
      inputType: 'text',
      initialValue: '',
      fields: [],
      validators: []
    }
  ] as FormField[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertFields', () => {
    it('should convert http response to fields', () => {
      expect(service.convertFields(httpResponse.data)).toEqual(expectFields);
    });
  });

  xdescribe('convertValidators', () => {
    it('should convert parameters of field to array of validators', () => {
      const parameters = {
        required: true,
        min_length: 5,
        max_length: 10
      } as FormFieldParamsFromResponse;
      const expected = [Validators.required, Validators.minLength(5), Validators.maxLength(10)];
      expect(service.convertValidators(parameters)).toEqual(expected);
    });
  });

  xdescribe('createSingleField', () => {
    it('should create single field', () => {
      const field = {
        id: 1,
        isMultiple: false,
        isGroup: false,
        placeholder: '',
        code: 'test_code',
        label: 'Test',
        inputType: 'text',
        initialValue: '',
        fields: [],
        validators: []
      } as FormField;
      const expectedForm = { test_code: new FormControl('', []) };
      const form = {};
      service.createSingleField(form, field);
      expect(form).toContain(expectedForm);
    });
    it('should create multiple field', () => {
      const field = {
        id: 1,
        isMultiple: true,
        isGroup: false,
        placeholder: '',
        code: 'test_code',
        label: 'Test',
        inputType: 'text',
        initialValue: '',
        fields: [],
        validators: []
      } as FormField;
      const expectedForm = {
        test_code: new FormGroup({
          input: new FormControl('', []),
          values: new FormArray([])
        })
      };
      const form = {};
      service.createSingleField(form, field);
      expect(form).toContain(expectedForm);
    });
  });

  describe('init', () => {
    it('should convert http response to fields on init', () => {
      const expectedForm = new FormGroup({
        test_code: new FormControl('')
      });
      spyOn(service.http, 'get').and.returnValue(of(httpResponse));
      service.init();
      expect(service.fields).toEqual(expectFields);
      expect(service.form.value).toEqual(expectedForm.value);
    });
  });

  describe('pushValueInSingleMultipleField', () => {
    it('add valid value to values', () => {
      service.form = new FormGroup({
        test_code: new FormGroup({
          input: new FormControl('value', []),
          values: new FormArray([])
        })
      });
      service.pushValueInSingleMultipleField('test_code', []);
      expect(service.form.get('test_code').get('input').value).toBeFalsy();
      expect((service.form.get('test_code').get('values') as FormArray).controls.length).toBe(1);
      expect((service.form.get('test_code').get('values') as FormArray).controls[0].value).toBe('value');
    });
  });
});
