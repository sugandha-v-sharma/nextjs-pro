import React from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Hourglass } from "lucide-react";
import { getAllTodos } from '@/pages/api/todos';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Props = {
  todos: Todo[];
};

const Todos = ({ todos }: Props) => {
  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/todos/${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
        Todo List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos.slice(0, 12).map((todo) => (
          <Card
            key={todo.id}
            className="cursor-pointer border hover:shadow-xl hover:scale-[1.01] transition-all"
            onClick={() => handleClick(todo.id)}
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{todo.title}</h2>
                <div className="flex items-center gap-2">
                  {todo.completed ? (
                    <>
                      <CheckCircle className="text-green-600 h-5 w-5" />
                      <Badge className="bg-green-500">Completed</Badge>
                    </>
                  ) : (
                    <>
                      <Hourglass className="text-yellow-500 h-5 w-5" />
                      <Badge className="bg-yellow-500 text-white">Pending</Badge>
                    </>
                  )}
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-fit self-end">
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const todos: Todo[] = await getAllTodos();
  return {
    props: {
      todos,
    },
  };
};

export default Todos;
