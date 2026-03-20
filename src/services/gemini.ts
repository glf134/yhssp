import { GoogleGenAI, Type } from "@google/genai";
import { HazardResult, HazardCategory, RiskLevel } from "../types";

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
    riskLevel: { 
      type: Type.STRING, 
      enum: ['高', '中', '低'],
      description: "风险等级" 
    },
    description: { type: Type.STRING, description: "隐患说明" },
    suggestion: { type: Type.STRING, description: "整改建议" },
    regulations: { type: Type.STRING, description: "违反的规定章程" },
    references: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "引用的文档列表" 
    }
  },
  required: ["name", "category", "riskLevel", "description", "suggestion", "regulations", "references"]
};

export async function identifyHazardFromImage(base64Image: string): Promise<HazardResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "你是一个工业安全专家。请分析这张图片中的安全隐患。请详细说明隐患名称、隐患说明、处置建议、违反了什么规定章程，以及引用了哪些文档。请以JSON格式返回结果。" },
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
          { text: `你是一个工业安全专家。请分析以下描述中的安全隐患： "${text}"。请详细说明隐患名称、隐患说明、处置建议、违反了什么规定章程，以及引用了哪些文档。请以JSON格式返回结果。` }
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
