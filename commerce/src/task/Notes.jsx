import React, { useState } from "react";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
} from "../store/api/TaskApi";
import { FileText, Plus, Search, Pin, Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "../textBook/EmptyState";
import { toast } from "react-toastify";

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "#FEF9C3",
  });

  const { data: notes, isLoading } = useGetNotesQuery();
  const [createNote] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const colors = [
    "#FEF9C3", // light yellow
    "#BFDBFE", // light blue
    "#C7D2FE", // light indigo
    "#D1FAE5", // light green
    "#FCE7F3", // light pink
    "#FFEDD5", // light orange
  ];

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pinnedNotes = filteredNotes?.filter((n) => n.isPinned) || [];
  const otherNotes = filteredNotes?.filter((n) => !n.isPinned) || [];

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await createNote(newNote).unwrap();
      toast.success("Note created successfully");
      setNewNote({ title: "", content: "", color: "#FEF9C3" });
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id).unwrap();
        toast.success("Note deleted");
      } catch (error) {
        toast.error("Failed to delete note");
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Capture your ideas and thoughts
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      {/* Create Note Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Note</h2>

          {/* Color Picker */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewNote({ ...newNote, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    newNote.color === color
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />

          {/* Content */}
          <textarea
            placeholder="Write your note..."
            value={newNote.content}
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
            >
              Create Note
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {!filteredNotes || filteredNotes.length === 0 ? (
        <EmptyState
          title="No notes found"
          message={
            searchQuery
              ? "Try a different search term"
              : "Create your first note to get started"
          }
          actionText={searchQuery ? "Clear Search" : "Create Note"}
          onAction={() =>
            searchQuery ? setSearchQuery("") : setShowCreateForm(true)
          }
          icon={<FileText className="h-16 w-16 text-gray-400" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned Notes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <div
                    key={note._id}
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all p-4 relative group"
                    style={{ backgroundColor: note.color }}
                  >
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    <h3 className="font-semibold mb-2 pr-8">{note.title}</h3>
                    <p className="text-sm whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Notes */}
          {otherNotes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">All Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherNotes.map((note) => (
                  <div
                    key={note._id}
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all p-4 relative group"
                    style={{ backgroundColor: note.color }}
                  >
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                    <h3 className="font-semibold mb-2 pr-8">{note.title}</h3>
                    <p className="text-sm whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
