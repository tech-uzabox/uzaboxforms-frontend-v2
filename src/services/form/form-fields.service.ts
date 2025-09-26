import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface FormField {
  id: string;
  label: string;
  type: string;
  formId: string;
  sectionId: string;
  sectionName: string;
  isSystemField?: boolean;
  options?: string[];
  required?: boolean;
}

export interface SystemField extends Omit<FormField, 'formId' | 'sectionId' | 'sectionName'> {
  isSystemField: true;
}

export interface FormFieldsResponse {
  formId: string;
  fields: FormField[];
  systemFields: SystemField[];
  formFields: FormField[];
}

export interface MultipleFormFieldsResponse {
  formFieldsMap: { [formId: string]: FormField[] };
  allFields: FormField[];
  systemFields: SystemField[];
}

class FormFieldsService {
  // Get fields for a single form
  getFormFields(formId: string): Promise<FormFieldsResponse> {
    return utils.handleApiRequest(() => authorizedAPI.get(`/forms/${formId}/fields`));
  }

  // Get fields for multiple forms
  getMultipleFormFields(formIds: string[]): Promise<MultipleFormFieldsResponse> {
    const params = new URLSearchParams();
    formIds.forEach(id => params.append('formIds', id));
    return utils.handleApiRequest(() => authorizedAPI.get(`/forms/fields/multiple?${params}`));
  }
}

export const formFieldsService = new FormFieldsService();
