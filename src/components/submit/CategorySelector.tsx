"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, Server, Check } from "lucide-react";
import { useState } from "react";
import { CategoryType } from "./SubmitContext";

interface CategorySelectorProps {
  onCategorySelect: (category: CategoryType) => void;
}

export function CategorySelector({ onCategorySelect }: CategorySelectorProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryType | null>(
    null
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Select Resource Type</h3>
        <p className="text-sm text-muted-foreground">
          Choose the type of resource you want to submit to our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className={`cursor-pointer transition-all ${
            hoveredCategory === "ai_tools"
              ? "border-primary shadow-md transform -translate-y-1"
              : "hover:border-primary/50"
          }`}
          onClick={() => onCategorySelect("ai_tools")}
          onMouseEnter={() => setHoveredCategory("ai_tools")}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">AI Tools</CardTitle>
            <CardDescription className="text-sm mt-2">
              AI-powered applications, services and resources that help users
              perform tasks more efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Text, image and
                code generators
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Design and
                creative tools
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Business and
                productivity assistants
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full">
              Submit AI Tool
            </Button>
          </CardFooter>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            hoveredCategory === "mcp_servers"
              ? "border-primary shadow-md transform -translate-y-1"
              : "hover:border-primary/50"
          }`}
          onClick={() => onCategorySelect("mcp_servers")}
          onMouseEnter={() => setHoveredCategory("mcp_servers")}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">MCP Servers</CardTitle>
            <CardDescription className="text-sm mt-2">
              API servers, libraries and resources that enable communication
              with AI models and services
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Text generation
                servers
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Image generation
                APIs
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-primary" /> Custom model
                deployments
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="default" className="w-full">
              Submit MCP Server
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
