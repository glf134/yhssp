export type RiskLevel = '高' | '中' | '低';

export type HazardCategory = 
  | '人员行为类' 
  | '设备设施类' 
  | '作业环境类' 
  | '安全防护类' 
  | '管理制度类';

export interface HazardResult {
  name: string;
  category: HazardCategory;
  riskLevel: RiskLevel;
  suggestion: string;
  regulations?: string;
  references?: string[];
}

export interface HazardRecord extends HazardResult {
  id: string;
  timestamp: number;
  type: 'image' | 'voice' | 'text';
  content?: string; // base64 for image, text for voice/text
  reported?: boolean;
}
