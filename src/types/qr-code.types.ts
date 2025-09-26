export interface GenerateQRCodeDto {
  documentName: string;
  host: string;
}

export interface QRCodeResponse {
  success?: boolean;
  message?: string;
  qrCodeDataUrl: string;
  qrCodeId: string;
}

export interface QRCode {
  id: string;
  name: string;
  host: string;
  qrCodeId: string;
  qrCodeDataUrl: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeListResponse {
  success: boolean;
  data: QRCode[];
  message?: string;
}

export interface QrCodeDocumentTypes {
  documentName: string;
  fileName: string;
  qrCodeId: string;
  creatorId: string;
}
