// lib/api/todos.ts

export type TodosList = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
  
  export async function getAllTodos(): Promise<TodosList[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  }
  
  export async function getTodoById(id: number): Promise<TodosList| null> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    if (!res.ok) return null;
    return res.json();
  }
  