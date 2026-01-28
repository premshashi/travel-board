import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Dummy email submission - just log and show success
    console.log("Feedback submitted:", {
      message,
      email: email || "Not provided",
      to: "feedback@travelboard.com", // Dummy email
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Feedback Sent!",
      description: "Thank you for your feedback. We appreciate it!",
    });

    setMessage("");
    setEmail("");
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Fixed Feedback Button on Right Side */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary text-primary-foreground px-2 py-4 rounded-l-lg shadow-lg hover:bg-primary/90 transition-colors"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4 rotate-90" />
          Feedback
        </span>
      </button>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Send Feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="feedback-message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback-message"
                placeholder="Tell us what you think, report a bug, or suggest an improvement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-y"
              />
            </div>

            {/* Contact Email Field */}
            <div className="space-y-2">
              <Label htmlFor="feedback-email">
                Contact Email <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="feedback-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Include if you'd like us to follow up with you.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackButton;
