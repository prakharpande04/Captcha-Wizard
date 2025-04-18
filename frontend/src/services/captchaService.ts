
export interface CaptchaRecognitionResponse {
  text: string;
  confidence?: number;
}

export const recognizeCaptcha = async (
  imageFile: File
): Promise<CaptchaRecognitionResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};
