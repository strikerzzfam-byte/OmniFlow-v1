import { useState } from "react";
import { X, Play, RotateCw, Move, Scale, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Konva from "konva";

interface AnimationPanelProps {
  selectedShape: any;
  onClose: () => void;
  onAnimationPlay?: (animationType: string, shape: any, duration: number) => void;
}

const AnimationPanel = ({ selectedShape, onClose, onAnimationPlay }: AnimationPanelProps) => {
  const [duration, setDuration] = useState([1]);
  const [selectedAnimation, setSelectedAnimation] = useState("");

  const animations = [
    { id: "fadeIn", name: "Fade In", icon: Zap },
    { id: "slideIn", name: "Slide In", icon: Move },
    { id: "scaleUp", name: "Scale Up", icon: Scale },
    { id: "rotate", name: "Rotate", icon: RotateCw },
    { id: "bounce", name: "Bounce", icon: Play },
  ];

  const playAnimation = (animationType: string) => {
    if (!selectedShape || !onAnimationPlay) return;
    onAnimationPlay(animationType, selectedShape, duration[0]);
  };

  return (
    <Card className="w-80 h-full bg-background border-l">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Animation</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {!selectedShape ? (
          <div className="text-center text-muted-foreground py-8">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select an object to animate</p>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Animation Type</label>
              <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose animation" />
                </SelectTrigger>
                <SelectContent>
                  {animations.map((anim) => (
                    <SelectItem key={anim.id} value={anim.id}>
                      <div className="flex items-center gap-2">
                        <anim.icon className="w-4 h-4" />
                        {anim.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Duration: {duration[0]}s
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {animations.map((anim) => (
                <Button
                  key={anim.id}
                  variant="outline"
                  size="sm"
                  onClick={() => playAnimation(anim.id)}
                  className="flex items-center gap-2"
                >
                  <anim.icon className="w-4 h-4" />
                  {anim.name}
                </Button>
              ))}
            </div>

            {selectedAnimation && (
              <Button 
                onClick={() => playAnimation(selectedAnimation)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Animation
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default AnimationPanel;