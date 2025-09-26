import { SectionTypes } from "@/types";
import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

export interface CreateFormDto {
  name: string;
  type: 'INTERNAL' | 'EXTERNAL';
  status: 'ENABLED' | 'DISABLED';
  creatorId: string;
  folderId?: string;
  design?: SectionTypes[];
}

export interface UpdateFormDto {
  name?: string;
  type?: 'INTERNAL' | 'EXTERNAL';
  status?: 'ENABLED' | 'DISABLED';
  creatorId?: string;
  folderId?: string;
  design?: SectionTypes[];
}

export interface FormFilters {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
}

class FormService {
  async getAllForms(filters?: FormFilters) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/forms?${params.toString()}`)
    );
  }

  async getFormById(formId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/forms/${formId}`)
    );
  }

  async createForm(formData: CreateFormDto) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/forms", formData)
    );
  }

  async updateForm(formId: string, formData: UpdateFormDto) {
    return utils.handleApiRequest(() =>
      authorizedAPI.patch(`/forms/${formId}`, formData)
    );
  }


  async deleteForm(formId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/forms/${formId}`)
    );
  }

  async getFormResponses(formId: string, filters?: any) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/forms/${formId}/responses?${params.toString()}`)
    );
  }

  async submitFormResponse(formId: string, responseData: any) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post(`/forms/${formId}/responses`, responseData)
    );
  }

  async duplicateForm(formId: string, newName: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post(`/forms/duplicate`, { formId, name: newName })
    );
  }

  async publishForm(formId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post(`/forms/${formId}/publish`)
    );
  }

  async unpublishForm(formId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.post(`/forms/${formId}/unpublish`)
    );
  }

  async getFormAnalytics(formId: string) {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/forms/${formId}/analytics`)
    );
  }

  async exportFormResponses(formId: string, format: 'csv' | 'xlsx' | 'pdf') {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/forms/${formId}/export?format=${format}`, {
        responseType: 'blob'
      })
    );
  }

  async getFormsWithCountries() {
    return utils.handleApiRequest(() =>
      authorizedAPI.get('/forms/with-countries')
    );
  }
}

export const formService = new FormService();
