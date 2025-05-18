"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { mcpServersSchema } from "./validation";
import { useSubmitContext } from "./SubmitContext";
import { submitMCPServer } from "./useSubmit";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLogo } from "./hooks/useLogo";
import { LogoPreview } from "./components/LogoPreview";

type MCPServerFormValues = z.infer<typeof mcpServersSchema>;

export function MCPServersForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { isSubmitting, setIsSubmitting, setSelectedType } = useSubmitContext();
  const [descriptionLength, setDescriptionLength] = useState(0);

  const form = useForm<MCPServerFormValues>({
    resolver: zodResolver(mcpServersSchema),
    defaultValues: {
      title: "",
      logo_url: "",
      description: "",
      url: "",
      email: "",
      type: 1, // MCP服务器类型
    },
  });

  // Watch for description field length
  const watchDescription = form.watch("description");
  const logoUrl = form.watch("logo_url");

  // 使用自定义Hook处理logo验证
  const { isLogoValid, isLogoLoading, setIsLogoValid, setIsLogoLoading } =
    useLogo(logoUrl);

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
    setSelectedType(null);
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

        {/* 使用共享Logo预览组件 */}
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
