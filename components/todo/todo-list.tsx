"use client";

import { trpc } from "@/lib/trpc/client";
import { TodoItem } from "./todo-item";
import { AddTodoForm } from "./add-todo-form";
import { Skeleton } from "@/components/ui/skeleton";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <span className="text-3xl">📝</span>
      </div>
      <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
      <p className="text-muted-foreground text-sm">
        Create your first task to get started
      </p>
    </div>
  );
}

function TodoItemSkeleton() {
  return (
    <div className="flex items-start gap-3 px-2 py-2 -mx-2">
      <Skeleton className="h-5 w-5 rounded shrink-0 mt-0.5" />
      <Skeleton className="h-5 flex-1 max-w-[70%]" />
    </div>
  );
}

function TodoListSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function TodoList() {
  const { data: todos = [], isLoading } = trpc.todos.list.useQuery();

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Notion-style page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-4xl">✅</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            My Tasks
          </h1>
        </div>
        {totalCount > 0 && (
          <p className="text-muted-foreground text-sm ml-14">
            {completedCount} of {totalCount} completed
          </p>
        )}
      </div>

      {/* Add todo form */}
      <div className="mb-6">
        <AddTodoForm />
      </div>

      {/* Todo list */}
      <div className="space-y-1">
        {isLoading ? (
          <TodoListSkeleton />
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
              imageUrl={todo.imageUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
