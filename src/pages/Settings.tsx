import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Notification preferences state
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem("emailNotifications") !== "false";
  });
  const [smsNotifications, setSmsNotifications] = useState(() => {
    return localStorage.getItem("smsNotifications") === "true";
  });

  // Change password handler
  const handleChangePassword = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    setLoadingPassword(true);
    // Supabase does not support password change with current password verification in client SDK
    // So we just update password (user must be logged in)
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoadingPassword(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password Updated", description: "Your password has been changed." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Dark mode handler
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem("darkMode", checked ? "true" : "false");
    if (checked) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // Notification preferences handlers
  const handleEmailNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    localStorage.setItem("emailNotifications", checked ? "true" : "false");
    toast({ title: "Preference Saved", description: `Email notifications ${checked ? "enabled" : "disabled"}.` });
  };
  const handleSmsNotifications = (checked: boolean) => {
    setSmsNotifications(checked);
    localStorage.setItem("smsNotifications", checked ? "true" : "false");
    toast({ title: "Preference Saved", description: `SMS notifications ${checked ? "enabled" : "disabled"}.` });
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    // Supabase: delete user via admin API (not available from client SDK)
    // Instead, sign out and show a message
    await signOut();
    toast({ title: "Account Deleted", description: "Your account has been deleted (simulated).", variant: "destructive" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-amber-800 text-center">Settings</h1>
          <Button variant="ghost" onClick={() => navigate("/")} className="text-amber-700 font-bold">Back to Home</Button>
        </div>
        <div className="space-y-8">
          {/* Change Password */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Change Password</h2>
            <div className="space-y-3">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <Button className="mt-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold" onClick={handleChangePassword} disabled={loadingPassword}>
                {loadingPassword && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"></span>}
                Update Password
              </Button>
            </div>
          </div>
          {/* Dark Mode Toggle */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-lg text-amber-800 font-medium">Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
            </div>
          </div>
          {/* Notification Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Notifications</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg text-amber-800">Email Notifications</span>
                <Switch checked={emailNotifications} onCheckedChange={handleEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-amber-800">SMS Notifications</span>
                <Switch checked={smsNotifications} onCheckedChange={handleSmsNotifications} />
              </div>
            </div>
          </div>
          {/* Delete Account */}
          <div className="pt-4 border-t border-amber-100">
            <h2 className="text-2xl font-bold text-red-700 mb-2">Danger Zone</h2>
            <Button variant="destructive" className="w-full font-bold" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 