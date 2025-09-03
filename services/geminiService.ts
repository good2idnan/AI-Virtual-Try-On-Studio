import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runImageEditing = async (modelImage: ImageInfo, clothingImage: ImageInfo): Promise<ImageInfo | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: modelImage.base64,
                            mimeType: modelImage.mimeType,
                        },
                    },
                    {
                        inlineData: {
                            data: clothingImage.base64,
                            mimeType: clothingImage.mimeType,
                        },
                    },
                    {
                        text: `
You are an expert AI fashion stylist specializing in photorealistic virtual try-on. Your task is to seamlessly fit the clothing from the second image onto the person in the first image.

Follow these instructions precisely:

1.  **Analyze the Person (First Image):**
    *   Identify the person's exact pose, body shape, and proportions.
    *   Observe the lighting, shadows, and overall ambiance of the image.
    *   **Crucially, you MUST preserve the person's identity, face, and skin tone without any modification.**

2.  **Analyze the Clothing (Second Image):**
    *   Carefully isolate the primary clothing item (e.g., the t-shirt, jacket, dress). Ignore any background elements.
    *   Retain the original texture, color, and fabric details of the clothing.

3.  **Perform the Virtual Try-On:**
    *   Realistically drape the isolated clothing onto the person. The clothing must conform to the person's body and pose, creating natural-looking wrinkles, folds, and shadows.
    *   The lighting on the clothing must be adjusted to perfectly match the lighting on the person. This is critical for a believable result.
    *   Ensure the final composition is photorealistic and free of any digital artifacts.

4.  **Final Output:**
    *   Generate a new image showing the person wearing the new clothing.
    *   The background of the final image must be a simple, clean, neutral gray to focus attention on the result.
    *   **Do NOT include any text or watermarks in the output image.** The output should be only the final image.
                        `,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            const { data, mimeType } = imagePart.inlineData;
            return {
                base64: data,
                mimeType: mimeType,
                url: `data:${mimeType};base64,${data}`
            };
        }
        return null;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};