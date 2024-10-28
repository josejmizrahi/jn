"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useFeedContext } from "./feed-provider";
import { useAuthContext } from "@/components/auth/auth-provider";

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateContentDialog({ open, onOpenChange, onSuccess }: CreateContentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createItem } = useFeedContext();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create content",
        variant: "destructive",
      });
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setIsSubmitting(true);
      
      const type = form.getAttribute('data-type') || 'post';
      const title = formData.get('title') as string;
      const description = formData.get('content') || formData.get('description') as string;
      const metadata: Record<string, any> = {};

      // Add type-specific metadata
      switch (type) {
        case 'event':
          metadata.date = formData.get('event-date');
          metadata.location = formData.get('event-location');
          break;
        case 'class':
          metadata.level = formData.get('class-level');
          metadata.duration = formData.get('class-duration');
          break;
        case 'product':
          metadata.price = formData.get('product-price');
          metadata.category = formData.get('product-category');
          break;
      }

      await createItem({
        type,
        title,
        description,
        metadata,
        author_id: user.id,
        status: 'active',
        visibility: 'public'
      });

      form.reset();
      onSuccess?.();
      
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    } catch (error) {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="class">Class</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
          </TabsList>

          <TabsContent value="post">
            <form onSubmit={handleSubmit} data-type="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Enter a title for your post" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your post content..."
                  className="min-h-[200px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media">Media (Optional)</Label>
                <Input id="media" name="media" type="file" accept="image/*,video/*" />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="event">
            <form onSubmit={handleSubmit} data-type="event" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" placeholder="Enter event title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" name="event-date" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input id="event-location" name="event-location" placeholder="Event location" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="class">
            <form onSubmit={handleSubmit} data-type="class" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title</Label>
                <Input id="title" name="title" placeholder="Enter class title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your class..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class-level">Level</Label>
                  <Input id="class-level" name="class-level" placeholder="e.g., Beginner" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class-duration">Duration</Label>
                  <Input id="class-duration" name="class-duration" placeholder="e.g., 60 minutes" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Class"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="product">
            <form onSubmit={handleSubmit} data-type="product" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input id="title" name="title" placeholder="Enter product title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price (MP)</Label>
                  <Input id="product-price" name="product-price" type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Input id="product-category" name="product-category" placeholder="e.g., Books" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}