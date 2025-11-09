import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Copy, RefreshCw, Save, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OmniGenerate = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [contentType, setContentType] = useState("blog");
  const { toast } = useToast();

  const contentTypes = [
    { value: "blog", label: "Blog Post" },
    { value: "script", label: "Video Script" },
    { value: "caption", label: "Social Caption" },
    { value: "tag", label: "SEO Tags" },
    { value: "product", label: "Product Description" },
  ];

  const history = [
    { title: "Product Launch Blog", type: "Blog", time: "2h ago" },
    { title: "Tutorial Script", type: "Script", time: "1d ago" },
    { title: "Instagram Caption", type: "Caption", time: "2d ago" },
  ];

  const handleGenerate = () => {
    const sampleOutput = `# Generated Content\n\nThis is a sample AI-generated ${contentType} based on your input:\n\n"${input}"\n\nThe content has been tailored to match your requirements and tone. You can now copy, regenerate, or save this draft for later use.`;
    setOutput(sampleOutput);
    toast({
      title: "Content generated",
      description: "Your AI-powered content is ready!",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">OmniGenerate</h1>
        <p className="text-muted-foreground">
          AI-powered content generation for any format
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card className="glass p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Topic & Instructions
                </label>
                <Textarea
                  placeholder="Describe what you want to generate... (e.g., 'Write a blog post about sustainable fashion for young adults')"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[150px] bg-muted/30 border-border/50"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full bg-primary hover:bg-primary/90 glow-primary"
                disabled={!input}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Generated Content</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg whitespace-pre-wrap">
                  {output}
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* History Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Recent Generations</h3>
            </div>
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <p className="font-medium mb-1">{item.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.type}</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OmniGenerate;
