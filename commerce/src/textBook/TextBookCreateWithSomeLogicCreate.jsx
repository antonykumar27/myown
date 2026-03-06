import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Upload, BookOpen, X, Image as ImageIcon } from "lucide-react";
import {
  useCreateTextBookMutation,
  useUpdateTextBookMutation,
  useGetTextBookByIdQuery,
} from "../store/api/TextBookApi";

const TextBookCreateWithSomeLogicCreate = ({
  standardSubjectId = null,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    media: null,
  });

  console.log("standardSubjectId", standardSubjectId);

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingMedia, setExistingMedia] = useState(null);

  // RTK Query hooks
  const [createTextBook, { isLoading: isCreating }] =
    useCreateTextBookMutation();
  const [updateTextBook, { isLoading: isUpdating }] =
    useUpdateTextBookMutation();

  const id = standardSubjectId;

  // Fetch data if editing
  const { data: existingData, isLoading: isFetching } = useGetTextBookByIdQuery(
    id,
    { skip: !id },
  );

  console.log("this is existingData", existingData);

  // Populate form when existing data is fetched
  useEffect(() => {
    if (existingData) {
      const data = existingData;
      console.log("Setting form data with:", data);

      setFormData({
        subject: data.subject || "",
        title: data.title || "",
        media: null,
      });

      // Store existing media separately
      if (data.media?.[0]) {
        setExistingMedia(data.media[0]);
        setImagePreview(data.media[0].url);
      }
    }
  }, [existingData]);

  // Reset form when standardSubjectId changes to null
  useEffect(() => {
    if (!standardSubjectId) {
      setFormData({
        subject: "",
        title: "",
        media: null,
      });
      setExistingMedia(null);
      setImagePreview(null);
    }
  }, [standardSubjectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // When new file is selected, update formData.media and clear existingMedia
      setFormData({ ...formData, media: file });
      setExistingMedia(null);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, media: null });
    setExistingMedia(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.subject?.trim()) {
        toast.error("Please enter a subject");
        setLoading(false);
        return;
      }

      if (!formData.title?.trim()) {
        toast.error("Please enter a title");
        setLoading(false);
        return;
      }

      const submitFormData = new FormData();
      submitFormData.append("subject", formData.subject);
      submitFormData.append("title", formData.title);

      if (standardSubjectId) {
        // ============================================
        // 🟢 EDIT MODE - FIXED LOGIC
        // ============================================
        submitFormData.append("id", standardSubjectId);

        // CASE 1: User uploaded NEW image
        if (formData.media instanceof File) {
          console.log("📸 CASE 1: Uploading new image");
          submitFormData.append("media", formData.media);
          // Don't send existingMedia - backend will delete old one
        }
        // CASE 2: User KEPT existing image (no change)
        else if (existingMedia) {
          console.log("📸 CASE 2: Keeping existing image");
          // 🟢 IMPORTANT: Send existingMedia as JSON string
          submitFormData.append(
            "existingMedia",
            JSON.stringify({
              url: existingMedia.url,
              public_id: existingMedia.public_id,
              type: existingMedia.type,
              pdfUrl: existingMedia.pdfUrl || null,
              size: existingMedia.size,
              _id: existingMedia._id,
            }),
          );
          // No media field sent
        }
        // CASE 3: User REMOVED image completely
        else {
          console.log("📸 CASE 3: No image (removed)");
          // Send empty existingMedia to indicate no media
          submitFormData.append("existingMedia", JSON.stringify([]));
        }

        console.log(
          "📤 Updating with data:",
          Object.fromEntries(submitFormData),
        );

        await updateTextBook({
          id: standardSubjectId,
          formData: submitFormData,
        }).unwrap();

        toast.success("Textbook updated successfully!");
      } else {
        // ============================================
        // CREATE MODE
        // ============================================
        if (formData.media instanceof File) {
          submitFormData.append("media", formData.media);
        }

        console.log(
          "📤 Creating with data:",
          Object.fromEntries(submitFormData),
        );
        await createTextBook(submitFormData).unwrap();
        toast.success("Textbook created successfully!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching && standardSubjectId) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subject Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Subject *
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="e.g., Mathematics, Science, English"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
          readOnly={!!standardSubjectId}
        />
        {standardSubjectId && (
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
            Subject cannot be changed
          </p>
        )}
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Part 1, Textbook, Workbook"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          Cover Image {imagePreview ? "(Click remove to change)" : "(Optional)"}
        </label>

        {!imagePreview ? (
          <label className="block cursor-pointer">
            <div className="flex flex-col items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-600 transition-all">
              <Upload className="h-12 w-12 mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload image
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                PNG, JPG up to 5MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {formData.media instanceof File ? "New Cover" : "Current Cover"}
              </span>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                Remove
              </button>
            </div>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Image+Not+Found";
              }}
            />
            <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
              {formData.media instanceof File
                ? "🟢 New image selected. Save to update."
                : existingMedia
                  ? "🟡 Current image. Upload new to replace."
                  : "No image"}
            </p>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          disabled={loading || isCreating || isUpdating}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || isCreating || isUpdating}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || isCreating || isUpdating
            ? standardSubjectId
              ? "Updating..."
              : "Creating..."
            : standardSubjectId
              ? "Update Textbook"
              : "Create Textbook"}
        </button>
      </div>
    </form>
  );
};

export default TextBookCreateWithSomeLogicCreate;
