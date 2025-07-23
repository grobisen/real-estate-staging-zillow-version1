import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, Link2, Image, Key, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ZillowUpload = () => {
  const [zillowUrl, setZillowUrl] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem('zenrows_api_key') || "");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);

  const extractZpidFromUrl = (url: string): string | null => {
    const zpidMatch = url.match(/\/(\d+)_zpid/);
    return zpidMatch ? zpidMatch[1] : null;
  };

  const handleUrlSubmit = async () => {
    if (!zillowUrl.trim()) {
      toast.error("Please enter a Zillow URL");
      return;
    }

    if (!zillowUrl.includes("zillow.com")) {
      toast.error("Please enter a valid Zillow URL");
      return;
    }

    if (!apiKey.trim()) {
      toast.error("Please enter your ZenRows API key");
      return;
    }

    const zpid = extractZpidFromUrl(zillowUrl);
    if (!zpid) {
      toast.error("Could not extract property ID from URL. Make sure it's a valid Zillow listing URL.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Save API key to localStorage
      localStorage.setItem('zenrows_api_key', apiKey);
      
      // Call ZenRows API to extract property data with anti-bot protection
      const response = await fetch(`https://realestate.api.zenrows.com/v1/targets/zillow/properties/${zpid}?apikey=${apiKey}&premium_proxy=true&proxy_country=US&js_render=true`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract images from the response
      const images: string[] = [];
      
      // Add main property image
      if (data.property_image) {
        images.push(data.property_image);
      }
      
      // Add gallery images if available
      if (data.gallery && Array.isArray(data.gallery)) {
        images.push(...data.gallery.map((img: any) => img.url || img).filter(Boolean));
      }
      
      // Add photos array if available
      if (data.photos && Array.isArray(data.photos)) {
        images.push(...data.photos.map((photo: any) => photo.url || photo).filter(Boolean));
      }
      
      if (images.length === 0) {
        toast.error("No images found in this listing");
        return;
      }
      
      setExtractedImages(images);
      toast.success(`Successfully extracted ${images.length} images from the listing`);
    } catch (error) {
      console.error('Error extracting images:', error);
      toast.error("Failed to extract images. Please check your API key and try again.");
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

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This feature requires a ZenRows API key to extract real Zillow images. 
            For production use, we recommend connecting to Supabase for secure API key management.
            Your API key will be stored locally in your browser.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              ZenRows API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your ZenRows API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Get your API key from{" "}
              <a 
                href="https://www.zenrows.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ZenRows.com
              </a>
              . Your key is stored locally and never shared.
            </p>
          </CardContent>
        </Card>

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
                placeholder="https://www.zillow.com/homedetails/123-main-st_82045711_zpid/"
                value={zillowUrl}
                onChange={(e) => setZillowUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleUrlSubmit}
                disabled={isLoading || !apiKey.trim()}
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
              Paste any Zillow listing URL with a ZPID (property ID) to extract all property images
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
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center hidden">
                        <Image className="w-12 h-12 text-muted-foreground" />
                      </div>
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