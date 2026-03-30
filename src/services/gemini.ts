import { GoogleGenAI, Type } from "@google/genai";
import { HazardResult, HazardCategory, HazardLevel, ViolationLevel, CheckType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const HAZARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "隐患名称" },
    category: { 
      type: Type.STRING, 
      enum: ['人员行为类', '设备设施类', '作业环境类', '安全防护类', '管理制度类'],
      description: "隐患分类" 
    },
    hazardLevel: { 
      type: Type.STRING, 
      enum: ['一般隐患', '较大1级', '较大2级', '重大隐患'],
      description: "隐患级别" 
    },
    violationLevel: { 
      type: Type.STRING, 
      enum: ['一类', '二类', '三类'],
      description: "违章级别" 
    },
    checkType: { 
      type: Type.STRING, 
      enum: ['日常检查', '专项检查'],
      description: "检查选项" 
    },
    description: { type: Type.STRING, description: "隐患说明" }
  },
  required: ["name", "category", "hazardLevel", "violationLevel", "checkType", "description"]
};

export async function identifyHazardFromImage(base64Image: string): Promise<HazardResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "你是一个工业安全专家。请分析这张图片中的安全隐患。请详细说明隐患名称、隐患说明。同时请判定隐患级别（一般隐患、较大1级、较大2级、重大隐患）、违章级别（一类、二类、三类）和检查选项（日常检查、专项检查）。请以JSON格式返回结果。" },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: HAZARD_SCHEMA
    }
  });

  return JSON.parse(response.text || '{}') as HazardResult;
}

export async function identifyHazardFromText(text: string): Promise<HazardResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: `你是一个工业安全专家。请分析以下描述中的安全隐患： "${text}"。请详细说明隐患名称、隐患说明。同时请判定隐患级别（一般隐患、较大1级、较大2级、重大隐患）、违章级别（一类、二类、三类）和检查选项（日常检查、专项检查）。请以JSON格式返回结果。` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: HAZARD_SCHEMA
    }
  });

  return JSON.parse(response.text || '{}') as HazardResult;
}
