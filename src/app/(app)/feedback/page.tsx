
"use client";

import { FeedbackForm } from "@/components/feedback-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <MessageSquareText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>We Value Your Feedback</CardTitle>
          <CardDescription>
            Please let us know how we can improve our service or what you enjoyed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  );
}
