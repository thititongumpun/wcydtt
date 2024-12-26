export interface Resources {
  resources: Resource[];
}

export interface Resource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  access_mode: string;
  url: string;
  secure_url: string;
}

export type ImageCloudinary = {
  public_id: string;
  blur_url: string;
}