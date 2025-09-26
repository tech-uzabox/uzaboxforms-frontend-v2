import { UtilsService } from '../utils';
import type { LevelTypes } from '@/types';
import { authorizedAPI } from '@/config/axios.config';

export interface AddToDatabaseParams {
    name?: string;
    status?: string;
    levels?: LevelTypes[];
}

const utils = new UtilsService();  

class AddToDatabaseService {
    createAddToDatabase(data: AddToDatabaseParams): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.post('/add-to-database', data));
    }

    getAllAddToDatabases(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get('/add-to-database'));
    }

    getAddToDatabaseById(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/add-to-database/${id}`));
    }

    updateAddToDatabase(id: string, data: AddToDatabaseParams): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.put(`/add-to-database/${id}`, data));
    }
}

export const addToDatabaseService = new AddToDatabaseService();
