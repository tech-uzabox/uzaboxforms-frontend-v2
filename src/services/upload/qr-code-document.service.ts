import { UtilsService } from '../utils';
import { authorizedAPI } from '@/config/axios.config';
import type { QrCodeDocumentTypes } from '@/types';

const utils = new UtilsService();

class QrCodeDocumentService {
    getAllQrCodeDocuments(): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get('/api/v1/qr-codes'));
    }

    createQrCodeDocument({ documentName, fileName, qrCodeId, creatorId }: QrCodeDocumentTypes): Promise<any> {
        console.log("🔍 QR Code Document Service - Input:", { documentName, fileName, qrCodeId, creatorId });
        
        const payload = { 
            documentName: documentName, 
            host: fileName, 
            qrCodeId, 
            creatorId 
        };
        
        console.log("🔍 QR Code Document Service - Payload being sent:", payload);
        
        return utils.handleApiRequest(() => authorizedAPI.post('/api/v1/qr-codes', payload));
    }

    getQrCodeDocumentById(id: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/api/v1/qr-codes/${id}`));
    }

    updateQrCodeDocument({ qrCodeId, documentName, fileName }: QrCodeDocumentTypes): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.patch(`/api/v1/qr-codes/${qrCodeId}`, { 
            documentName: documentName, 
            host: fileName 
        }));
    }

    deleteQrCodeDocument({ qrCodeId }: { qrCodeId: string }): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.delete(`/api/v1/qr-codes/${qrCodeId}`));
    }

    getQrCodeDocumentsByCreatorId(creatorId: string): Promise<any> {
        return utils.handleApiRequest(() => authorizedAPI.get(`/api/v1/qr-codes/by-creator/${creatorId}`));
    }
}

export const qrCodeDocumentService = new QrCodeDocumentService();
