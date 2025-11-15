import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAvatar } from "@/contexts/AvatarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useRef } from "react";

const DashboardSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { avatarUrl, setAvatarUrl } = useAvatar();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.displayName || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been changed.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Profile</h3>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20 border-4 border-primary/50">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <Button 
                variant="outline" 
                className="border-primary/50 hover:bg-primary/10"
                onClick={handleAvatarChange}
              >
                Change Avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-muted/30 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-muted/30 border-border/50 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your projects
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Suggestions</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about AI recommendations
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Theme</Label>
              <div className="flex gap-3 mt-2">
                <Button 
                  variant="outline" 
                  className={`flex-1 ${theme === 'dark' ? 'bg-primary/10 border-primary/50' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex-1 ${theme === 'light' ? 'bg-primary/10 border-primary/50' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex-1 ${theme === 'auto' ? 'bg-primary/10 border-primary/50' : ''}`}
                  onClick={() => setTheme('auto')}
                >
                  Auto
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Security</h3>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start border-border/50">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start border-border/50">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start border-border/50 text-destructive">
              Delete Account
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 glow-primary"
        >
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
};

export default DashboardSettings;
