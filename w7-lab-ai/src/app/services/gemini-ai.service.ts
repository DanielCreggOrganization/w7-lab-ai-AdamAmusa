import { Injectable } from '@angular/core';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'gemini-1.5-flash';
  
  async getImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const base64String = base64data.split(',')[1];
      return base64String;
    } catch (error) {
      throw new Error('Failed to get image as base64');
    } 
  }

  async generateRecipe(imageBase64: string, prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(environment.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            },
            { text: prompt }
          ]
        }]
      });

      const output = result.response.text();    
      return output;
    } catch (error) {
      throw new Error('Failed to generate recipe');
    }
  }
}