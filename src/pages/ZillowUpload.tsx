import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Link2, Image } from "lucide-react";

const ZillowUpload = () => {
  const [zillowUrl, setZillowUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);

  const handleUrlSubmit = async () => {
    if (!zillowUrl.trim()) {
      toast.error("Please enter a Zillow URL");
      return;
    }

    if (!zillowUrl.includes("zillow.com")) {
      toast.error("Please enter a valid Zillow URL");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate image extraction - in real implementation, you'd use a web scraping service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted images
      const mockImages = [
        "https://photos.zillowstatic.com/fp/example1.jpg",
        "https://photos.zillowstatic.com/fp/example2.jpg",
        "https://photos.zillowstatic.com/fp/example3.jpg",
      ];
      
      setExtractedImages(mockImages);
      toast.success(`Successfully extracted ${mockImages.length} images from the listing`);
    } catch (error) {
      toast.error("Failed to extract images from Zillow listing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    // Navigate to staging studio with selected image
    toast.success("Image selected! Redirecting to staging studio...");
    // In real implementation: navigate to studio with image data
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Import Zillow Listing
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a Zillow listing URL to extract property images for staging
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Zillow URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://www.zillow.com/homedetails/..."
                value={zillowUrl}
                onChange={(e) => setZillowUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleUrlSubmit}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Extract
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Paste any Zillow listing URL to automatically extract all property images
            </p>
          </CardContent>
        </Card>

        {extractedImages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Extracted Images ({extractedImages.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extractedImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Image className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        Select for Staging
                      </Button>
                    </div>
                    <div className="p-2">
                      <p className="text-sm text-muted-foreground">
                        Room {index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {extractedImages.length === 0 && (
          <div className="text-center py-12">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No images extracted yet
            </h3>
            <p className="text-muted-foreground">
              Enter a Zillow URL above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZillowUpload;