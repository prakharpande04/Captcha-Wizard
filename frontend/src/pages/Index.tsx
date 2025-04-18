
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, FileText, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CaptchaImageUploader from "@/components/CaptchaImageUploader";
import { recognizeCaptcha } from "@/services/captchaService";
import { motion } from "framer-motion";

const Index = () => {
  const [image, setImage] = useState<File | null>(null);
  const [captchaText, setCaptchaText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setImage(file);
    setCaptchaText(null);
    setConfidence(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      toast({
        title: "No image selected",
        description: "Please select an image containing a captcha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCaptchaText(null);
    setError(null);
    
    try {
      const data = await recognizeCaptcha(image);
      console.log(data);
      setCaptchaText(data.prediction);
      setConfidence(data.confidence || null);
      toast({
        title: "Success!",
        description: "Captcha text recognized successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recognize captcha");
      toast({
        title: "Recognition failed",
        description: "There was an error recognizing the captcha text.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Captcha Wizard</h1>
            <p className="text-gray-600">Upload any captcha image and let our AI decode it for you</p>
          </div>

          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Image Recognition</CardTitle>
              <CardDescription>Upload an image to extract captcha text</CardDescription>
            </CardHeader>
            <CardContent>
              <CaptchaImageUploader 
                onImageSelect={handleImageSelect}
                isProcessing={isLoading}
                onSubmit={handleSubmit}
              />

              {/* Results Section */}
              {(captchaText || isLoading) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Recognition Result
                  </h2>
                  {isLoading ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Processing your image...
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <div className="font-mono text-2xl text-center py-2 text-purple-700">{captchaText}</div>
                      {confidence !== null && (
                        <div className="text-sm text-gray-500 text-center mt-2">
                          Confidence level: {confidence.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50/50 rounded-b-lg flex flex-col items-start py-4 px-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">How it works</h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-600">
                <li>Upload an image containing a captcha</li>
                <li>Our AI processes and analyzes the characters</li>
                <li>Get the extracted text instantly</li>
              </ol>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
