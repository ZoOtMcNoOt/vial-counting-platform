export interface ProcessedImageResult {
  original_image_base64: string;
  processed_image_base64: string;
  counted_vials: number;
  percentage: string;
  lot_id: string;
  order_number: string;
  tray_number: string;
}

export interface Result {
  id: number;
  original_image_url: string;
  processed_image_url: string;
  counted_vials: number;
  percentage: number;
  lot_id: string;
  order_number: string;
  tray_number: string;
  created_at: string;
}