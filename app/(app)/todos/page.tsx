import { TodoList } from "@/components/todo";

export default function TodosPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-12">
        <TodoList />
      </div>
    </main>
  );
}
