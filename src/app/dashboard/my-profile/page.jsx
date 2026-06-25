"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  Edit3, 
  X, 
  Lock, 
  Image as ImageIcon, 
  Link2, 
  Upload, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

import { updateUserProfile } from "@/app/lib/actions/userActions";

// 🌟 Securely pulls the API Key from your .env environment configurations
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 

export default function MyProfile() {
  const { data: session, isPending: isSessionPending, refetch } = authClient.useSession();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  
  // Image Input Mode toggle state: 'url' or 'upload'
  const [avatarInputMode, setAvatarInputMode] = useState("url");
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!isSessionPending && session?.user) {
      setProfileName(session.user.name || "");
      setProfileImage(session.user.image || "");
    }
  }, [session, isSessionPending]);

  // Async function handler to manage file transformations & ImgBB upload pipelines
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 🌟 Safety check: verify the environment key exists before calling the endpoint
    if (!IMGBB_API_KEY) {
      toast.error("ImgBB Key configuration is missing in environment variables.");
      console.error("Missing NEXT_PUBLIC_IMGBB_API_KEY in your .env file.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file format.");
      return;
    }

    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        setProfileImage(data.data.url);
        toast.success("Image uploaded successfully to ImgBB!");
      } else {
        throw new Error(data.error?.message || "Failed parsing ImgBB remote node assets.");
      }
    } catch (error) {
      console.error("ImgBB upload runtime pipeline exception:", error);
      toast.error("Cloud upload failed. Please verify API configuration schema.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    try {
      const result = await updateUserProfile({
        name: profileName,
        image: profileImage,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      if (newPassword.trim() !== "") {
        if (currentPassword.trim() === "") {
          throw new Error("Validation Error: Current password is required to set a new password.");
        }

        await authClient.changePassword({
          currentPassword: currentPassword,
          newPassword: newPassword,
          revokeOtherSessions: true,
        });
      }

      await refetch();
      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Profile client submit error:", error);
      toast.error(error.message || "Failed to save updates.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] w-full">
        <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
      </div>
    );
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">
          My Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal credentials, contact points, and identity settings.
        </p>
      </div>

      {/* CORE IDENTITY DISPLAY CARD */}
      {session?.user ? (
        <div className="bg-white border border-slate-200/80 shadow-xs p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <User className="w-8 h-8" />
                </div>
              )}
              
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h2 className="text-xl font-bold text-slate-800 leading-none">
                    {session.user.name}
                  </h2>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Admin Staff
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {session.user.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingProfile(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
          Please log in to view profile configurations.
        </div>
      )}

      {/* COMPONENT DRAWER MODAL OVERLAY */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 relative rounded-2xl shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* CLOSE ACTION */}
            <button
              onClick={() => {
                setIsEditingProfile(false);
                setCurrentPassword("");
                setNewPassword("");
              }}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-xl text-slate-800 tracking-tight">
                Edit Profile Details
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Modify your database profile metadata attributes.</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4 pt-2">
              {/* FULL NAME */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* TOGGLE BUTTON CONTAINER (URL vs UPLOAD) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Profile Avatar Source
                </label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/40">
                  <button
                    type="button"
                    onClick={() => setAvatarInputMode("url")}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                      avatarInputMode === "url" 
                        ? "bg-white text-slate-800 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" /> Image Link URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarInputMode("upload")}
                    className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                      avatarInputMode === "upload" 
                        ? "bg-white text-slate-800 shadow-xs" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File (ImgBB)
                  </button>
                </div>
              </div>

              {/* DYNAMIC AVATAR INPUT FORM ACTIONS */}
              {avatarInputMode === "url" ? (
                /* MODE A: DIRECT LINK INPUT */
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Image Link URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>
              ) : (
                /* MODE B: DIRECT ASSET FILE UPLOADER */
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Select Avatar File
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl py-4 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                      {isUploadingFile ? (
                        <div className="flex flex-col items-center gap-1.5 text-slate-600">
                          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                          <span className="text-xs font-medium">Uploading to cloud storage...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-500">
                          <Upload className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-medium">Click to select local image file</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={isUploadingFile}
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                    </label>
                    
                    {profileImage && (
                      <img 
                        src={profileImage} 
                        alt="Preview" 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                </div>
              )}

              <hr className="border-slate-100 my-2" />

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Credentials</h4>
              </div>

              {/* CURRENT PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all"
                  />
                </div>
              </div>

              {/* SAVE ACTION */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile || isUploadingFile}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all disabled:bg-slate-700 shadow-sm shadow-slate-900/10"
                >
                  {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdatingProfile ? "Saving Profile..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}