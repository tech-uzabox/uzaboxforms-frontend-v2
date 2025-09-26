export interface serviceItem {
  serviceId: string;
  serviceName: string;
  unitAmount: string;
  code: string;
}

export interface serviceGroupItem {
  groupId: string;
  name: string;
  services: serviceItem[];
}
