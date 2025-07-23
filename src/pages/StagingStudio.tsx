import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Palette, 
  Square, 
  Circle as CircleIcon, 
  Download, 
  Undo, 
  Redo,
  Save,
  Trash2
} from "lucide-react";

const StagingStudio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("select");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);
    toast.success("Staging studio ready!");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = 2;
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 100,
      });
      fabricCanvas?.add(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: activeColor,
        radius: 50,
      });
      fabricCanvas?.add(circle);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast.success("Canvas cleared!");
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    // Convert canvas to image
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `staged-room-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast.success("Staged room saved!");
  };

  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
    "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            AI Staging Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            Design and stage rooms with AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tool Selection */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Drawing Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={activeTool === "select" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("select")}
                    >
                      Select
                    </Button>
                    <Button
                      variant={activeTool === "draw" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("draw")}
                    >
                      <Palette className="w-4 h-4 mr-1" />
                      Draw
                    </Button>
                    <Button
                      variant={activeTool === "rectangle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("rectangle")}
                    >
                      <Square className="w-4 h-4 mr-1" />
                      Rectangle
                    </Button>
                    <Button
                      variant={activeTool === "circle" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToolClick("circle")}
                    >
                      <CircleIcon className="w-4 h-4 mr-1" />
                      Circle
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Color Selection */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Colors</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-md border-2 transition-all ${
                          activeColor === color 
                            ? "border-foreground scale-110" 
                            : "border-border hover:border-foreground"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setActiveColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Undo className="w-4 h-4 mr-2" />
                      Undo
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Redo className="w-4 h-4 mr-2" />
                      Redo
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleClear}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button variant="default" size="sm" className="w-full" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Project
                    </Button>
                    <Button variant="secondary" size="sm" className="w-full" onClick={handleSave}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staging Canvas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="staging-canvas border-2 border-staging-border rounded-lg overflow-hidden">
                  <canvas ref={canvasRef} className="max-w-full" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <p className="text-sm text-muted-foreground">
                    Use the tools on the left to start staging your room. 
                    Select furniture from your library to place in the scene.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagingStudio;