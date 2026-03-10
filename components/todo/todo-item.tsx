"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Trash2, X, Check } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  imageUrl?: string | null;
}

/* Notion-style checkbox component */
function NotionCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0",
        "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked
          ? "bg-primary border-primary text-primary-foreground"
          : "border-muted-foreground/40 bg-transparent",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {checked && (
        <Check className="w-3 h-3" strokeWidth={3} />
      )}
    </button>
  );
}

export function TodoItem({ id, title, completed, imageUrl }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showFullImage, setShowFullImage] = useState(false);

  const utils = trpc.useUtils();

  const toggleMutation = trpc.todos.toggle.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
  });

  const updateMutation = trpc.todos.update.useMutation({
    onSuccess: () => {
      utils.todos.list.invalidate();
      setIsEditing(false);
    },
  });

  const deleteMutation = trpc.todos.delete.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
  });

  const isLoading =
    toggleMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  function handleToggle() {
    toggleMutation.mutate({ id });
  }

  function handleDelete() {
    deleteMutation.mutate({ id });
  }

  function handleUpdate() {
    if (editTitle.trim() === "") return;
    if (editTitle.trim() === title) {
      setIsEditing(false);
      return;
    }
    updateMutation.mutate({ id, title: editTitle });
  }

  function handleCancel() {
    setEditTitle(title);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-muted/50">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 h-9 bg-background border-muted-foreground/20 focus-visible:ring-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUpdate();
            if (e.key === "Escape") handleCancel();
          }}
          disabled={isLoading}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUpdate}
          disabled={isLoading}
          className="h-8 w-8 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
        >
          <Check className="h-4 w-4 text-emerald-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isLoading}
          className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 px-2 py-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors">
      <div className="pt-0.5">
        <NotionCheckbox
          checked={completed}
          onChange={handleToggle}
          disabled={isLoading}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-base leading-relaxed block",
            completed && "line-through text-muted-foreground"
          )}
        >
          {title}
        </span>
        {imageUrl && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowFullImage(!showFullImage)}
              className="block"
            >
              <img
                src={imageUrl}
                alt="Todo attachment"
                className={cn(
                  "rounded-md object-cover transition-all cursor-pointer hover:opacity-90",
                  showFullImage ? "max-w-full max-h-96" : "h-20 w-20"
                )}
              />
            </button>
          </div>
        )}
      </div>
      
      {/* Notion-style hover actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
