// import React, { useState } from "react";

// import { useUpdateUserMutation } from "../store/api/authApi";
// import {
//   Settings as SettingsIcon,
//   User,
//   Bell,
//   Shield,
//   Moon,
//   Sun,
// } from "lucide-react";
// import LoadingSpinner from "./LoadingSpinner";
// import toast from "";
// import { useTheme } from "../hooks/useTheme";
// import { useAuth } from "../common/AuthContext";

// const Settings = () => {
//   const { user } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const [updateUser, { isLoading }] = useUpdateUserMutation();

//   const [formData, setFormData] = useState({
//     name: user?.name || "",
//     email: user?.email || "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [notifications, setNotifications] = useState({
//     emailNotifications: true,
//     taskReminders: true,
//     projectUpdates: false,
//     weeklyReport: true,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       formData.newPassword &&
//       formData.newPassword !== formData.confirmPassword
//     ) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       await updateUser(formData).unwrap();
//       toast.success("Settings updated successfully");
//     } catch (error) {
//       toast.error("Failed to update settings");
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Settings
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Manage your account preferences
//           </p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sidebar */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
//             <nav className="space-y-1">
//               {[
//                 { icon: User, label: "Profile", active: true },
//                 { icon: Bell, label: "Notifications", active: false },
//                 { icon: Shield, label: "Privacy", active: false },
//                 {
//                   icon: theme === "dark" ? Sun : Moon,
//                   label: "Appearance",
//                   active: false,
//                 },
//               ].map((item, index) => {
//                 const Icon = item.icon;
//                 return (
//                   <button
//                     key={index}
//                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                       item.active
//                         ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
//                         : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                     }`}
//                   >
//                     <Icon className="h-5 w-5" />
//                     <span>{item.label}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="lg:col-span-3">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
//               <SettingsIcon className="h-5 w-5" />
//               Profile Settings
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Profile Info */}
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-lg">Personal Information</h3>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Name</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
//                   />
//                 </div>
//               </div>

//               {/* Change Password */}
//               <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="font-semibold text-lg">Change Password</h3>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Current Password
//                   </label>
//                   <input
//                     type="password"
//                     value={formData.currentPassword}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         currentPassword: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     value={formData.newPassword}
//                     onChange={(e) =>
//                       setFormData({ ...formData, newPassword: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     value={formData.confirmPassword}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         confirmPassword: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
//                   />
//                 </div>
//               </div>

//               {/* Notifications */}
//               <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="font-semibold text-lg">Notifications</h3>

//                 {[
//                   { key: "emailNotifications", label: "Email Notifications" },
//                   { key: "taskReminders", label: "Task Reminders" },
//                   { key: "projectUpdates", label: "Project Updates" },
//                   { key: "weeklyReport", label: "Weekly Report" },
//                 ].map((item) => (
//                   <label key={item.key} className="flex items-center gap-3">
//                     <input
//                       type="checkbox"
//                       checked={notifications[item.key]}
//                       onChange={(e) =>
//                         setNotifications({
//                           ...notifications,
//                           [item.key]: e.target.checked,
//                         })
//                       }
//                       className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//                     />
//                     <span>{item.label}</span>
//                   </label>
//                 ))}
//               </div>

//               {/* Appearance */}
//               <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <h3 className="font-semibold text-lg">Appearance</h3>

//                 <button
//                   type="button"
//                   onClick={toggleTheme}
//                   className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
//                 >
//                   {theme === "dark" ? (
//                     <>
//                       <Sun className="h-5 w-5" />
//                       <span>Switch to Light Mode</span>
//                     </>
//                   ) : (
//                     <>
//                       <Moon className="h-5 w-5" />
//                       <span>Switch to Dark Mode</span>
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
//                 >
//                   {isLoading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;
import React from "react";

function Settings() {
  return <div>Settings</div>;
}

export default Settings;
