"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, Copy, Check } from "lucide-react";

interface ReleaseNotesDialogProps {
  sprintId: string;
  sprintName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReleaseNotesDialog({
  sprintId,
  sprintName,
  open,
  onOpenChange,
}: ReleaseNotesDialogProps) {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/release-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprintId }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes(data.releaseNotes);
        setHasGenerated(true);
      }
    } catch (error) {
      console.error("Failed to generate notes", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sprint Release Notes</DialogTitle>
          <DialogDescription>
            Generate AI-powered release notes for {sprintName}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!hasGenerated && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-purple-100 p-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Ready to generate?
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                AI will analyze all tasks in this sprint and create a formatted
                summary of your team's progress.
              </p>
              <button
                onClick={generateNotes}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
              >
                <Sparkles className="h-4 w-4" />
                Generate Release Notes
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
              <p className="mt-4 text-sm text-gray-500">
                Writing release notes...
              </p>
            </div>
          )}

          {hasGenerated && (
            <div className="relative rounded-md border bg-gray-50 p-4">
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-2 rounded p-1.5 text-gray-500 hover:bg-gray-200"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                {notes}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
