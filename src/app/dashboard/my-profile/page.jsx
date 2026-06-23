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
  Image, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

// Import the direct MongoDB Server Action we built for user metadata
import { updateUserProfile } from "@/app/lib/actions/userActions";

export default function MyProfile() {
  // Use Better Auth's reactive session hook
  const { data: session, isPending: isSessionPending, refetch } = authClient.useSession();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  // 🌟 Password state variables
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Sync state whenever the user session loads or changes
  useEffect(() => {
    if (!isSessionPending && session?.user) {
      setProfileName(session.user.name || "");
      setProfileImage(session.user.image || "");
    }
  }, [session, isSessionPending]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    try {
      // 1. Execute the secure Next.js Server Action for metadata updates
      const result = await updateUserProfile({
        name: profileName,
        image: profileImage,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // 2. 🌟 If a new password was typed, update it securely via Better Auth Client API
      if (newPassword.trim() !== "") {
        if (currentPassword.trim() === "") {
          throw new Error("Validation Error: Current password is required to set a new password.");
        }

        await authClient.changePassword({
          currentPassword: currentPassword,
          newPassword: newPassword,
          revokeOtherSessions: true, // Optional security best-practice
        });
      }

      // Refresh the client-side session state cache
      await refetch();

      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      
      // Reset input fields
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

              {/* IMAGE URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Image Link URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-500 transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

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
                  disabled={isUpdatingProfile}
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