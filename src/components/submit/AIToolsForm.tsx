"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import { aiToolsSchema } from "./validation";
import { useSubmitContext } from "./SubmitContext";
import { submitAITool } from "./useSubmit";
import { z } from "zod";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLogo } from "./hooks/useLogo";
import { LogoPreview } from "./components/LogoPreview";

type AIToolFormValues = z.infer<typeof aiToolsSchema>;

const TOOL_TYPES = [
  { value: "saas", label: "SaaS" },
  { value: "api", label: "API" },
  { value: "open_source", label: "Open Source" },
  { value: "browser_extension", label: "Browser Extension" },
  { value: "other", label: "Other" },
];

export function AIToolsForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { setIsSubmitting, isSubmitting, setSelectedCategory } =
    useSubmitContext();
  const [descriptionLength, setDescriptionLength] = useState(0);

  const form = useForm<AIToolFormValues>({
    resolver: zodResolver(aiToolsSchema),
    defaultValues: {
      title: "",
      logo_url: "",
      description: "",
      url: "",
      email: "",
      tool_type: "saas",
    },
  });

  const watchDescription = form.watch("description");
  const logoUrl = form.watch("logo_url");

  const { isLogoValid, isLogoLoading, setIsLogoValid, setIsLogoLoading } =
    useLogo(logoUrl);

  useEffect(() => {
    setDescriptionLength(watchDescription?.length || 0);
  }, [watchDescription]);

  async function onSubmit(data: AIToolFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    // Ensure tool_type is never empty or null
    const submissionData = {
      ...data,
      tool_type: data.tool_type || "saas",
    };

    try {
      await submitAITool(submissionData);
      onSuccess();
    } catch (error) {
      console.error("Submission failed:", error);
      let errorMessage = "Submission failed. Please try again later.";

      // Handle error from the API
      if (error instanceof Error) {
        errorMessage = error.message;

        // Check if it's an RLS policy error and provide a clearer message
        if (errorMessage.includes("violates row-level security policy")) {
          errorMessage =
            "We're experiencing a permissions issue with our database. We've been notified and are working on a fix. Please try again later.";
        }
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBack = () => {
    setSelectedCategory(null);
  };

  // Check if all required fields are filled
  const isFormComplete = () => {
    const { title, logo_url, description, url, tool_type } = form.getValues();

    // Make sure all required fields have values and tool_type has a valid value
    return (
      title.length >= 2 &&
      isLogoValid &&
      description.length >= 10 &&
      url.length > 0 &&
      !!tool_type // Ensure tool_type is not empty
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center mb-4">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h3 className="text-lg font-medium ml-2">AI Tool Submission</h3>
        </div>

        <LogoPreview
          logoUrl={logoUrl}
          isLogoValid={isLogoValid}
          isLogoLoading={isLogoLoading}
          setIsLogoValid={setIsLogoValid}
          setIsLogoLoading={setIsLogoLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., AI Content Generator"
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brief Description*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this AI tool does..."
                  className="resize-none min-h-[80px]"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setDescriptionLength(e.target.value.length);
                  }}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground flex justify-between mt-1">
                <span>Recommended: 50-150 characters</span>
                <span
                  className={`${
                    descriptionLength > 150 ? "text-destructive" : ""
                  }`}
                >
                  {descriptionLength}/150
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource URL*</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tool_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tool Type (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TOOL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isFormComplete()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
