import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, Validator, Validators, ValidatorFn } from '@angular/forms';

// interface of response data
interface FormFieldParamsFromResponse {
  default_value: string | number | boolean;
  min_length?: number;
  max_length?: number;
}

interface FormFieldFromResponse {
  id: number;
  type: 'form_field' | 'form_field_group';
  attributes: {
    is_multiple: boolean;
    code: string;
    name: string;
    placeholder?: string;
    parameters: FormFieldParamsFromResponse | null;
  };
  relationships: {
    form_attribute_type?: {
      data: {
        id: number;
        attributes: {
          code: 'text'
        }
        type: 'form_field_type'
      }
    }
    fields?: {
      data: FormFieldFromResponse[]
    }
  };
}

interface FormFieldsFromResponse {
  data: FormFieldFromResponse[];
}

// local interface
export interface FormField {
  id: number;
  isMultiple: boolean;
  isGroup: boolean;
  placeholder: string;
  code: string;
  label: string;
  inputType: 'text' | null;
  fields?: FormField[];
  initialValue: string | number | boolean;
  validators: ValidatorFn[];
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  public fields: FormField[] = [];
  public form: FormGroup = new FormGroup({});
  constructor(private http: HttpClient) {}

  private convertValidators(fieldParameters): ValidatorFn[] {
    const validators = [];
    if ('required' in fieldParameters) {
      validators.push(Validators.required);
    }
    if ('min_length' in fieldParameters) {
      validators.push(Validators.minLength(fieldParameters.min_length));
    }
    if ('max_length' in fieldParameters) {
      validators.push(Validators.maxLength(fieldParameters.max_length));
    }
    return validators;
  }
  private convertFields(fields: FormFieldFromResponse[]): FormField[] {
    return fields.map(field => ({
      id: field.id,
      isMultiple: field.attributes.is_multiple,
      isGroup: field.type === 'form_field_group',
      placeholder: field.attributes.placeholder || '',
      code: field.attributes.code,
      label: field.attributes.name,
      inputType: field.relationships.form_attribute_type?.data.attributes.code || null,
      fields: field.relationships.fields ? this.convertFields(field.relationships.fields.data) : [],
      initialValue: field.attributes.parameters ? field.attributes.parameters.default_value : '',
      validators: field.attributes.parameters ? this.convertValidators(field.attributes.parameters) : []
    }));
  }

  private createSingleField(formGroup: object, field: FormField): void {
    if (!field.isMultiple) {
      formGroup[field.code] = new FormControl(field.initialValue, field.validators);
    } else {
      formGroup[field.code] = new FormGroup({
        input: new FormControl(field.initialValue, field.validators),
        values: new FormArray([])
      });
    }
  }

  init() {
    this.http.get<FormFieldsFromResponse>('assets/data.json')
    .subscribe(response => {
      const { data } = response;

      const convertedFields = this.convertFields(data);
      const group = {};
      convertedFields.forEach(field => {
        if (!field.isGroup) {
          this.createSingleField(group, field);
        } else if (!field.isMultiple) {
          const subGroup = {};
          field.fields.forEach(subField => this.createSingleField(subGroup, subField));
          group[field.code] = new FormGroup(subGroup);
        } else {
          const subGroup = {};
          field.fields.forEach(subField => this.createSingleField(subGroup, subField));
          group[field.code] = new FormArray([
            new FormGroup(subGroup)
          ]);
        }
      });

      this.fields = convertedFields;
      this.form = new FormGroup(group);
    });
  }

  pushValueInSingleMultipleField(fieldCode: string, pathToRootForm: string[] = []) {
    pathToRootForm = [...pathToRootForm, fieldCode];

    const formGroup = pathToRootForm.reduce((form, currentPath) =>
      Array.isArray(form.controls) ? form.controls[currentPath] : form.get(currentPath), this.form);

    const input = formGroup.get('input');
    const values = formGroup.get('values') as FormArray;

    if (formGroup.valid) {
      values.push(new FormControl(input.value, input.validator));
      input.reset();
    }
  }

  submit() {
    console.log(this.form.value);
  }
}
