import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Upload, 
  Image, 
  Trash2, 
  Search, 
  Tag, 
  Plus,
  FolderPlus 
} from "lucide-react";

interface FurnitureItem {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
  category: string;
  dateAdded: string;
}

const MediaLibrary = () => {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([
    {
      id: "1",
      name: "Modern Gray Sofa",
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
      tags: ["sofa", "gray", "modern"],
      category: "Living Room",
      dateAdded: "2024-01-15",
    },
    {
      id: "2", 
      name: "Oak Dining Table",
      imageUrl: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
      tags: ["table", "wood", "dining"],
      category: "Dining Room",
      dateAdded: "2024-01-10",
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ["All", "Living Room", "Dining Room", "Bedroom", "Kitchen", "Office"];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      try {
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        
        // Simulate AI background removal processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newItem: FurnitureItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          imageUrl,
          tags: ["furniture"],
          category: "Uncategorized",
          dateAdded: new Date().toISOString().split('T')[0],
        };
        
        setFurnitureItems(prev => [newItem, ...prev]);
        toast.success(`${file.name} processed and added to library`);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    }
    
    setIsProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const filteredItems = furnitureItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (id: string) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from library");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            My Furniture Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload and manage your furniture photos for virtual staging
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Furniture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-primary font-medium">
                    Processing images with AI background removal...
                  </p>
                </div>
              ) : isDragActive ? (
                <p className="text-lg text-primary">Drop the files here...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg text-foreground">
                    Drag & drop furniture images here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI will automatically remove backgrounds • Supports JPG, PNG, WebP
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search furniture by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Furniture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="furniture-item group">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3 relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
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
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-foreground mb-2 truncate">
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{item.category}</span>
                  <span>{item.dateAdded}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No furniture items found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filters"
                : "Upload your first furniture item to get started"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;