export type HazardLevel = '一般隐患' | '较大1级' | '较大2级' | '重大隐患';
export type ViolationLevel = '一类' | '二类' | '三类';
export type CheckType = '日常检查' | '专项检查';

export type HazardCategory = 
  | '人员行为类' 
  | '设备设施类' 
  | '作业环境类' 
  | '安全防护类' 
  | '管理制度类';

export interface HazardResult {
  name: string;
  category: HazardCategory;
  hazardLevel: HazardLevel;
  violationLevel: ViolationLevel;
  checkType?: CheckType;
  description: string;
}

export interface HazardRecord extends HazardResult {
  id: string;
  timestamp: number;
  type: 'image' | 'voice' | 'text';
  content?: string; // base64 for image, text for voice/text
  reported?: boolean;
  feedback?: string;
  rating?: 'like' | 'dislike' | null;
}
