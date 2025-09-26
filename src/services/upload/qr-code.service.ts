import type {
  GenerateQRCodeDto,
  QRCodeResponse,
  QRCodeListResponse,
} from "@/types";
import { UtilsService } from "../utils";
import { authorizedAPI } from "@/config/axios.config";

const utils = new UtilsService();

class QRCodeService {
  // POST /qr-codes
  async generateQRCode({
    documentName,
    host,
  }: GenerateQRCodeDto): Promise<QRCodeResponse> {
    console.log("🔍 QR Code Service - Input:", { documentName, host });
    
    const payload = { 
      documentName: documentName, 
      host 
    };
    
    console.log("🔍 QR Code Service - Payload being sent:", payload);
    
    return utils.handleApiRequest(() =>
      authorizedAPI.post("/qr-codes", payload)
    );
  }

  // GET /qr-codes
  async getAllQRCodes(filters?: any): Promise<QRCodeListResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
    }

    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/qr-codes?${params.toString()}`)
    );
  }

  // GET /qr-codes/{id}
  async getQRCodeById(id: string): Promise<QRCodeResponse> {
    return utils.handleApiRequest(() => authorizedAPI.get(`/qr-codes/${id}`));
  }

  // PATCH /qr-codes/{id}
  async updateQRCode(
    id: string,
    data: Partial<GenerateQRCodeDto>
  ): Promise<QRCodeResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.patch(`/qr-codes/${id}`, data)
    );
  }

  // DELETE /qr-codes/{id}
  async deleteQRCode(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return utils.handleApiRequest(() =>
      authorizedAPI.delete(`/qr-codes/${id}`)
    );
  }

  // GET /qr-codes/by-qr-code-id/{qrCodeId}
  async getQRCodeByQrCodeId(qrCodeId: string): Promise<QRCodeResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/qr-codes/by-qr-code-id/${qrCodeId}`)
    );
  }

  // GET /qr-codes/by-creator/{creatorId}
  async getQRCodesByCreator(creatorId: string): Promise<QRCodeListResponse> {
    return utils.handleApiRequest(() =>
      authorizedAPI.get(`/qr-codes/by-creator/${creatorId}`)
    );
  }
}

export const qrCodeService = new QRCodeService();
