"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the base schema for common fields
const baseSchema = {
  type: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  media_urls: z.array(z.string().url()).optional(),
};

// Schema for event posts
const eventSchema = z.object({
  ...baseSchema,
  type: z.literal("event"),
  eventType: z.enum(["online", "in-person", "hybrid"]),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  address: z.string().optional(),
  virtualLink: z.string().url().optional(),
  maxAttendees: z.number().min(1).optional(),
  cost: z.number().min(0).optional(),
  category: z.enum(["social", "religious", "educational", "cultural", "other"]),
});

// Schema for Torah study posts
const studySchema = z.object({
  ...baseSchema,
  type: z.literal("study"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.string(),
  topic: z.string(),
  materials: z.array(z.string()).optional(),
  prerequisites: z.string().optional(),
  language: z.enum(["hebrew", "english", "both"]),
});

// Schema for discussion posts
const discussionSchema = z.object({
  ...baseSchema,
  type: z.literal("discussion"),
  category: z.enum(["torah", "culture", "current-events", "philosophy", "other"]),
  tags: z.array(z.string()).optional(),
});

// Schema for marketplace posts
const marketplaceSchema = z.object({
  ...baseSchema,
  type: z.literal("marketplace"),
  price: z.number().min(0),
  category: z.enum(["judaica", "books", "art", "services", "other"]),
  condition: z.enum(["new", "like-new", "good", "fair"]).optional(),
  shipping: z.boolean(),
  location: z.string().optional(),
});

// Schema for general posts
const generalPostSchema = z.object({
  ...baseSchema,
  type: z.literal("post"),
  category: z.enum(["announcement", "question", "story", "other"]),
});

// Combine all schemas
const postSchema = z.discriminatedUnion("type", [
  eventSchema,
  studySchema,
  discussionSchema,
  marketplaceSchema,
  generalPostSchema,
]);

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostProps {
  onSubmit: (data: PostFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [postType, setPostType] = useState<string>("post");

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: "post",
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const renderFormFields = () => {
    switch (postType) {
      case "event":
        return (
          <>
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {(form.watch("eventType") === "in-person" || form.watch("eventType") === "hybrid") && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter venue address" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {(form.watch("eventType") === "online" || form.watch("eventType") === "hybrid") && (
              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Meeting Link</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter meeting URL" />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Attendees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (MP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        );

      case "study":
        return (
          <>
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Study Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select study level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter study topic" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 60 minutes" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hebrew">Hebrew</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </>
        );

      case "marketplace":
        return (
          <>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (MP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="judaica">Judaica</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like-new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Available</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your location" />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        );

      default:
        return (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setPostType(value);
                      form.reset({ type: value as any });
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">General Post</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="study">Torah Study</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your post..."
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderFormFields()}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Post
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}