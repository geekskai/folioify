"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  SubmitProvider,
  useSubmitContext,
  SubmissionType,
} from "./SubmitContext";
import { CategorySelector } from "./CategorySelector";
import { AIToolsForm } from "./AIToolsForm";
import { MCPServersForm } from "./MCPServersForm";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SubmitModalTrigger() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const handleSubmitSuccess = () => {
    setOpen(false);
    toast({
      title: "Submission Successful",
      description:
        "Thank you for your contribution! We will review it shortly.",
      variant: "default",
    });
  };

  // 渲染响应式提交按钮和模态窗口
  return (
    <SubmitProvider>
      {isDesktop ? (
        // 桌面版使用Dialog
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              Submit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogTitle>Submit Your Resource</DialogTitle>
            <DialogDescription>
              Share your favorite resources to help others discover quality
              content.
            </DialogDescription>
            <SubmitModalContent
              onSuccess={handleSubmitSuccess}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        // 移动版使用Sheet
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              Submit
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
            <SheetTitle>Submit Your Resource</SheetTitle>
            <SheetDescription>
              Share your favorite resources to help others discover quality
              content.
            </SheetDescription>
            <SubmitModalContent
              onSuccess={handleSubmitSuccess}
              onCancel={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}
    </SubmitProvider>
  );
}

// 根据类型渲染对应的表单组件
function getTypeForm(
  type: SubmissionType,
  props: { onSuccess: () => void; onCancel: () => void }
) {
  switch (type) {
    case 0: // AI工具
      return <AIToolsForm {...props} />;
    case 1: // MCP服务器
      return <MCPServersForm {...props} />;
    default:
      return null;
  }
}

function SubmitModalContent({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { selectedType, setSelectedType } = useSubmitContext();

  const handleCategorySelect = (type: SubmissionType) => {
    setSelectedType(type);
  };

  return (
    <div className="space-y-4 py-4">
      {selectedType === null ? (
        <CategorySelector onCategorySelect={handleCategorySelect} />
      ) : (
        <>{getTypeForm(selectedType, { onSuccess, onCancel })}</>
      )}
    </div>
  );
}
