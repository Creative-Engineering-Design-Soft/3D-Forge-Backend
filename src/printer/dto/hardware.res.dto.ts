export interface SuccessConnectionDTO {
  hardwareId: string;
}

export interface SuccessStatusDTO {
  hardwareId: string;
  bedTemp: number;
  nozzleTemp: number;
  isPrinting: boolean;
  x: number;
  y: number;
  z: number;
}

export interface SuccessUploadDTO {
  hardwareId: string;
}
