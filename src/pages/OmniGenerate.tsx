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
    { value: "blog", label: "Blog Post", placeholder: "Write a comprehensive blog post about [topic] targeting [audience]. Include key points, examples, and actionable insights." },
    { value: "script", label: "Video Script", placeholder: "Create a video script for [platform] about [topic]. Duration: [time]. Include hook, main content, and call-to-action." },
    { value: "caption", label: "Social Media Caption", placeholder: "Write an engaging social media caption for [platform] about [topic]. Include relevant hashtags and emojis." },
    { value: "email", label: "Email Marketing", placeholder: "Create a marketing email for [campaign/product]. Include subject line, body, and clear CTA." },
    { value: "product", label: "Product Description", placeholder: "Write a compelling product description for [product name]. Highlight key features, benefits, and target audience." },
    { value: "press", label: "Press Release", placeholder: "Draft a press release announcing [news/event]. Include headline, dateline, and company boilerplate." },
    { value: "ad", label: "Ad Copy", placeholder: "Create ad copy for [platform/medium] promoting [product/service]. Focus on benefits and strong CTA." },
    { value: "newsletter", label: "Newsletter", placeholder: "Write a newsletter section about [topic]. Include engaging headlines and valuable content for subscribers." },
    { value: "landing", label: "Landing Page Copy", placeholder: "Create landing page copy for [product/service]. Include headline, benefits, features, and conversion elements." },
    { value: "seo", label: "SEO Content", placeholder: "Write SEO-optimized content for [keyword/topic]. Include meta description, headers, and keyword integration." },
    { value: "story", label: "Brand Story", placeholder: "Craft a compelling brand story for [company/product]. Include origin, mission, values, and unique selling proposition." },
    { value: "case", label: "Case Study", placeholder: "Write a case study about [project/client success]. Include challenge, solution, implementation, and results." }
  ];

  const history = [
    { title: "AI SaaS Product Launch", type: "Blog Post", time: "2h ago" },
    { title: "YouTube Tutorial Script", type: "Video Script", time: "4h ago" },
    { title: "LinkedIn Growth Tips", type: "Social Caption", time: "1d ago" },
    { title: "Email Campaign - Black Friday", type: "Email Marketing", time: "1d ago" },
    { title: "Wireless Headphones Review", type: "Product Description", time: "2d ago" },
    { title: "Company Funding News", type: "Press Release", time: "3d ago" },
    { title: "Google Ads - Fitness App", type: "Ad Copy", time: "3d ago" },
    { title: "Tech Weekly Newsletter", type: "Newsletter", time: "1w ago" }
  ];

  const handleGenerate = () => {
    const contentTypeLabel = contentTypes.find(type => type.value === contentType)?.label || contentType;
    const sampleOutputs = {
      blog: `# ${input.split(' ').slice(0, 4).join(' ')} - Complete Guide\n\n## Introduction\nIn today's landscape, ${input.toLowerCase()} has become essential. This guide covers everything you need to know.\n\n## Key Points\n• Strategic implementation approach\n• Industry best practices\n• Measurable results and KPIs\n\n## Conclusion\nImplement these strategies consistently for optimal results.`,
      script: `[HOOK - 0:00-0:05]\n"Ready to master ${input.toLowerCase()}?"\n\n[INTRO - 0:05-0:15]\nToday we're covering ${input.toLowerCase()} step by step.\n\n[MAIN - 0:15-2:30]\n• Foundation concepts\n• Implementation steps\n• Common pitfalls\n\n[CTA - 2:30-2:45]\nLike and subscribe for more!`,
      caption: `🚀 Insights on ${input.toLowerCase()}!\n\n✨ Key takeaways:\n💡 Consistency is crucial\n🎯 Focus on results\n\nWhat's your experience? Comment below! 👇\n\n#Growth #Success #Tips`,
      email: `Subject: Transform Your ${input}\n\nHi there!\n\nExciting news about ${input.toLowerCase()}:\n\n• Proven strategies\n• Real case studies\n• Actionable steps\n\n[Get Started Now]\n\nBest regards!`,
      default: `# Generated ${contentTypeLabel}\n\nContent for: "${input}"\n\nThis AI-generated ${contentTypeLabel.toLowerCase()} includes:\n• Engaging structure\n• Relevant formatting\n• Clear call-to-action\n\nReady to use, copy, or regenerate!`
    };
    
    setOutput(sampleOutputs[contentType] || sampleOutputs.default);
    toast({
      title: "Content generated",
      description: `Your ${contentTypeLabel.toLowerCase()} is ready!`,
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
                  placeholder={contentTypes.find(type => type.value === contentType)?.placeholder || "Describe what you want to generate..."}
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
