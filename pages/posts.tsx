import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:1337/api/posts?populate=*")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">
            Discover our latest articles and insights
          </p>

          {/* Search Section */}
          {/* <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search posts..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>Create New Post</Button>
          </div> */}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post?.title}</CardTitle>
                  <CardDescription>
                    Published on {formatDate(post?.publishedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {post?.content}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {/* <Button variant="outline" size="sm">
                    Read More
                  </Button> */}
                  <span className="text-sm text-muted-foreground">
                    Updated: {new Date(post?.updatedAt).toLocaleTimeString()}
                  </span>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">
                No posts found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div> */}
      </div>
    </div>
  );
}
