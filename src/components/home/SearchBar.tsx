"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="flex items-center max-w-xl mx-auto bg-white rounded-full p-1 pl-5 shadow-md">
        <Search size={20} className="text-gray-400 mr-2" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索应用、游戏或软件包..."
          className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 text-gray-500"
        />
        <Button
          type="submit"
          className="rounded-full bg-indigo-600 hover:bg-purple-700 text-white px-6 py-2 h-10"
        >
          搜索
        </Button>
      </div>
    </form>
  );
}
