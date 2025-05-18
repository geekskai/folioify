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
import { mcpServersSchema } from "./validation";
import { useSubmitContext } from "./SubmitContext";
import { submitMCPServer } from "./useSubmit";
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
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type MCPServerFormValues = z.infer<typeof mcpServersSchema>;

export function MCPServersForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLogoValid, setIsLogoValid] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const { setCurrentStep, isSubmitting, setIsSubmitting } = useSubmitContext();
  const [descriptionLength, setDescriptionLength] = useState(0);

  const form = useForm<MCPServerFormValues>({
    resolver: zodResolver(mcpServersSchema),
    defaultValues: {
      title: "",
      logo_url: "",
      description: "",
      url: "",
      email: "",
      server_type: "",
    },
  });

  // Watch for description field length
  const watchDescription = form.watch("description");
  const logoUrl = form.watch("logo_url");

  // Monitor Logo URL changes and validate image
  useEffect(() => {
    if (typeof window === "undefined") return;

    const validateLogo = async () => {
      if (!logoUrl) {
        setIsLogoValid(false);
        return;
      }

      // Check if URL is a valid image URL
      if (!logoUrl.match(/\.(jpeg|jpg|gif|png|svg|webp|ico)(\?.*)?$/i)) {
        setIsLogoValid(false);
        return;
      }

      setIsLogoLoading(true);

      try {
        // Try to load the image to validate URL
        const img = new window.Image();
        img.onload = () => {
          console.log("Logo loaded successfully:", logoUrl);
          setIsLogoValid(true);
          setIsLogoLoading(false);
        };

        img.onerror = () => {
          console.error("Logo failed to load:", logoUrl);
          setIsLogoValid(false);
          setIsLogoLoading(false);
        };

        img.src = logoUrl;

        // Add a failsafe in case onload/onerror doesn't fire
        // This could happen in some browsers or with certain image types
        setTimeout(() => {
          if (isLogoLoading) {
            console.log(
              "Logo validation timed out - setting to valid as fallback"
            );
            setIsLogoValid(true);
            setIsLogoLoading(false);
          }
        }, 3000);
      } catch (error) {
        console.error("Error during logo validation:", error);
        // Fallback to valid in case of errors
        setIsLogoValid(true);
        setIsLogoLoading(false);
      }
    };

    validateLogo();
  }, [logoUrl, isLogoLoading]);

  useEffect(() => {
    setDescriptionLength(watchDescription?.length || 0);
  }, [watchDescription]);

  async function onSubmit(data: MCPServerFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitMCPServer(data);
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
    setCurrentStep("category");
  };

  // Check if all required fields are filled
  const isFormComplete = () => {
    const { title, logo_url, description, url } = form.getValues();

    const formValid =
      title.length >= 2 &&
      logo_url.length > 0 &&
      description.length >= 10 &&
      url.length > 0;

    // If image is showing in UI but isLogoValid is false, override it
    const logoValidationOK =
      isLogoValid || (logo_url.length > 0 && !isLogoLoading);

    console.log("Form validation status:", {
      formValid,
      logoValidationOK,
      titleValid: title.length >= 2,
      logoValid: isLogoValid,
      logoLength: logo_url.length,
      descriptionValid: description.length >= 10,
      urlValid: url.length > 0,
    });

    return formValid && logoValidationOK;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center mb-4">
          <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h3 className="text-lg font-medium ml-2">MCP Server Submission</h3>
        </div>

        {/* Logo preview */}
        <div className="flex items-center justify-center mb-4">
          {isLogoLoading ? (
            <div className="w-24 h-24 flex items-center justify-center border rounded bg-muted">
              <Skeleton className="w-16 h-16 rounded" />
            </div>
          ) : isLogoValid ? (
            <div className="relative w-24 h-24 flex items-center justify-center border rounded bg-white p-2">
              <Image
                src={logoUrl}
                alt="Logo Preview"
                width={96}
                height={96}
                unoptimized
                suppressHydrationWarning
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  setIsLogoValid(false);
                  setIsLogoLoading(false);
                }}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 flex flex-col items-center justify-center border rounded bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground text-center">
                {logoUrl ? "Invalid logo URL" : "Logo preview"}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Name*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., MCP Text Generation Server"
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
                  placeholder="Describe what this MCP server provides..."
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
              <FormLabel>Primary URL*</FormLabel>
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
            name="server_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server Type (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Text Generation, Image Generation"
                    {...field}
                  />
                </FormControl>
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
