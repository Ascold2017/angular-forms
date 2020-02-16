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
      required: false,
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

  describe('convertValidators', () => {
    it('should convert parameters of field to array of validators', () => {
      const parameters = {
        required: true,
        min_length: 5,
        max_length: 10
      } as FormFieldParamsFromResponse;
      const expected = [Validators.required, Validators.minLength(5), Validators.maxLength(10)];
      expect(service.convertValidators(parameters).length).toBe(3);
    });
  });

  describe('createSingleField', () => {
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
        required: false,
        fields: [],
        validators: []
      } as FormField;
      const form: any = {};
      service.createSingleField(form, field);
      expect(form.test_code).toBeDefined();
      expect((form.test_code as FormControl).value).toBe('');
      expect((form.test_code as FormControl).validator).toBeFalsy();
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
        required: false,
        fields: [],
        validators: []
      } as FormField;

      const form: any = {};
      service.createSingleField(form, field);
      expect(form.test_code).toBeDefined();
      expect(form.test_code.get('input')).toBeDefined();
      expect(form.test_code.get('values')).toBeDefined();
      expect(form.test_code.get('input').value).toBe('');
      expect(form.test_code.get('values').controls.length).toBe(0);
      expect(form.test_code.get('input').validator).toBeFalsy();
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

  describe('pushMultipleGroup', () => {
    it('add row', () => {
      service.fields = [
        {
          id: 1,
          code: 'test_code',
          isGroup: true,
          isMultiple: true,
          placeholder: '',
          label: 'Test',
          inputType: 'text',
          initialValue: '',
          required: false,
          validators: [],
          fields: [
            {
              id: 1,
              code: 'test_subfield_code',
              isGroup: false,
              isMultiple: false,
              placeholder: 'Test',
              label: 'Test',
              inputType: 'text',
              initialValue: '',
              required: false,
              validators: [],
              fields: []
            }
          ]
        }
      ];
      service.form = new FormGroup({
        test_code: new FormArray([
          new FormGroup({
            test_subfield_code: new FormControl('123')
          })
        ])
      });
      service.pushMultipleGroup('test_code', []);
      expect((service.form.get('test_code') as FormArray).controls.length).toBe(2);
      expect(service.form.get('test_code').get('1').get('test_subfield_code')).toBeDefined();
      expect(service.form.get('test_code').get('1').get('test_subfield_code').value).toBe('');
    });
  });
});
