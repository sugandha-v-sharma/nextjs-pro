import { GetServerSideProps } from "next";
import React from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTodoById } from '@/pages/api/todos';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Props = {
  todo: Todo;
};

const TodoDetail = ({ todo }: Props) => {
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="shadow-lg border">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Todo Detail</h1>
          
          <div className="text-lg font-medium">{todo.title}</div>
          
          <Badge
            className={`w-fit ${
              todo.completed ? "bg-green-500" : "bg-yellow-500 text-white"
            }`}
          >
            {todo.completed ? "Completed" : "Not Completed"}
          </Badge>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>ID:</strong> {todo.id}</p>
            <p><strong>User ID:</strong> {todo.userId}</p>
          </div>

          <Button variant="outline" onClick={() => router.push("/todos")}>
            ⬅ Back to Todos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const todo = await getTodoById(Number(id));
  return {
    props: {
      todo,
    },
  };
};

export default TodoDetail;
