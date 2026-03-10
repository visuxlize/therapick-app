"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ImagePlus, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { createClient } from "@/lib/supabase/client";
import {
  uploadTodoImage,
  validateImageFile,
  deleteTodoImageClient,
} from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";
import { RequiresSubscription } from "@/components/requires-subscription";

export function AddTodoForm() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const createMutation = trpc.todos.create.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
    onError: async (_err, variables) => {
      if (variables.imagePath) {
        await deleteTodoImageClient(variables.imagePath);
      }
    },
  });

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.trim() === "") return;

    setIsLoading(true);
    setUploadError(null);

    let imagePath: string | null = null;

    // Upload image if selected
    if (selectedFile) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUploadError("You must be logged in to upload images");
        setIsLoading(false);
        return;
      }

      const { path, error } = await uploadTodoImage(selectedFile, user.id);

      if (error) {
        setUploadError(error);
        setIsLoading(false);
        return;
      }

      imagePath = path;
    }

    createMutation.mutate(
      { title, imagePath },
      {
        onSettled: () => {
          setTitle("");
          clearSelectedFile();
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Notion-style add task input */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 -mx-2 rounded-md transition-colors cursor-text",
          isFocused ? "bg-muted/50" : "hover:bg-muted/30"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="w-5 h-5 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center shrink-0">
          <Plus className="w-3 h-3 text-muted-foreground/50" />
        </div>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a task..."
          className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/60"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && title.trim()) {
              handleSubmit(e);
            }
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        
        {/* Action buttons - show when focused or has content */}
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity",
            isFocused || title.trim() ? "opacity-100" : "opacity-0"
          )}
        >
          <RequiresSubscription message="Upgrade to Pro to attach images to your tasks.">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isLoading}
              className="h-7 w-7 hover:bg-muted"
              title="Add image"
            >
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
            </Button>
          </RequiresSubscription>
          {title.trim() && (
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-7 px-3 text-xs font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-destructive pl-9">{uploadError}</p>
      )}

      {previewUrl && (
        <div className="relative inline-block ml-9">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-20 w-20 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={clearSelectedFile}
            className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-1 hover:opacity-80 transition-opacity"
            disabled={isLoading}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </form>
  );
}
