/**
 * Auto-Dash Card Component
 * Displays AI-generated task suggestions for Premium users
 * Helps with decision paralysis by suggesting specific, achievable tasks
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoDashCardProps {
  energyLevel: "low" | "medium" | "high";
  moodLevel: number;
  timeAvailable: "2min" | "5min" | "15min";
  onTaskCreated?: (taskId: number) => void;
  className?: string;
}

export function AutoDashCard({
  energyLevel,
  moodLevel,
  timeAvailable,
  onTaskCreated,
  className,
}: AutoDashCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const generateMutation = trpc.autoDash.generateSuggestion.useMutation();
  const acceptMutation = trpc.autoDash.accept.useMutation();
  const rejectMutation = trpc.autoDash.reject.useMutation();
  const getActiveSuggestion = trpc.autoDash.getActive.useQuery();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMutation.mutateAsync({
        energyLevel,
        moodLevel,
        timeAvailable,
      });

      if (result.success) {
        setShowSuggestion(true);
        // Refetch the active suggestion
        getActiveSuggestion.refetch();
      }
    } catch (error) {
      console.error("Error generating suggestion:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!getActiveSuggestion.data?.id) return;

    try {
      const result = await acceptMutation.mutateAsync({
        suggestionId: getActiveSuggestion.data.id,
      });

      if (result.success) {
        onTaskCreated?.(result.taskId);
        setShowSuggestion(false);
        getActiveSuggestion.refetch();
      }
    } catch (error) {
      console.error("Error accepting suggestion:", error);
    }
  };

  const handleReject = async () => {
    if (!getActiveSuggestion.data?.id) return;

    try {
      await rejectMutation.mutateAsync({
        suggestionId: getActiveSuggestion.data.id,
      });

      setShowSuggestion(false);
      getActiveSuggestion.refetch();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
    }
  };

  const suggestion = getActiveSuggestion.data;

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200",
        className
      )}
    >
      {!showSuggestion ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Auto-Dash</h3>
          </div>

          <p className="text-sm text-gray-700">
            Stuck on what to do? Let me suggest something perfect for your energy level right now.
          </p>

          <div className="flex gap-2 text-xs text-gray-600">
            <span className="px-2 py-1 bg-white rounded-full">
              Energy: {energyLevel}
            </span>
            <span className="px-2 py-1 bg-white rounded-full">
              Mood: {moodLevel}/5
            </span>
            <span className="px-2 py-1 bg-white rounded-full">
              {timeAvailable}
            </span>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isGenerating ? "Generating..." : "Get a Suggestion"}
          </Button>
        </div>
      ) : suggestion ? (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Here's a suggestion:</h3>
          </div>

          <div className="bg-white p-3 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-900">
              {suggestion.suggestedTaskTitle}
            </h4>
            <p className="text-sm text-gray-700">
              {suggestion.suggestedTaskDescription}
            </p>
            {suggestion.estimatedMinutes && (
              <p className="text-xs text-gray-500">
                ⏱️ About {suggestion.estimatedMinutes} minutes
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              disabled={acceptMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              {acceptMutation.isPending ? "Creating..." : "Let's Do It"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectMutation.isPending}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Skip
            </Button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="ghost"
            className="w-full text-purple-600 hover:text-purple-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
