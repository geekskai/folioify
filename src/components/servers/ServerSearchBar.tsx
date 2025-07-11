"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { createServerClient } from "@/lib/supabase";

interface ServerSearchResult {
  id: string | number;
  name: string;
  category: string;
  description?: string;
  categorySlug?: string;
  categoryId?: string;
}

interface ServerItem {
  id: string | number;
  mcpName?: string;
  name?: string;
  description?: string;
}

export function ServerSearchBar() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ServerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createServerClient();

  // Use debounce to reduce search frequency
  const debouncedSearchTerm = useDebounce(searchQuery, 300);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const isClient = typeof window !== "undefined";
    if (!isClient) return;
    if (searchQuery.trim()) {
      // Get the current URL path
      const currentPath = window.location.pathname;

      // Navigate to current path with search parameter
      router.push(`${currentPath}?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: ServerSearchResult) => {
    setSearchQuery(suggestion.name);
    const isClient = typeof window !== "undefined";
    if (!isClient) return;
    // Get the current URL path
    const currentPath = window.location.pathname;

    // Navigate to the current path with the search term
    router.push(`${currentPath}?search=${encodeURIComponent(suggestion.name)}`);
    setShowSuggestions(false);
  };

  // Clear search content and reset URL
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    const isClient = typeof window !== "undefined";
    if (!isClient) return;
    // Get the current URL path
    const currentPath = window.location.pathname;

    // Navigate to the current path without search parameters
    router.push(currentPath);

    // Focus the input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle keyboard events (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If enter key is pressed and suggestions are shown
    if (e.key === "Enter" && showSuggestions && suggestions.length > 0) {
      e.preventDefault();
      // Use the first suggestion
      handleSuggestionClick(suggestions[0]);
    }
  };

  // Listen for click events outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    const isClient = typeof window !== "undefined";
    if (!isClient) return;

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search across all category tables when query changes
  useEffect(() => {
    const searchServers = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        // Get all category tables from Supabase
        const { data: categories } = await supabase
          .from("a_mcp_category")
          .select("*");

        if (!categories || categories.length === 0) {
          setIsSearching(false);
          return;
        }

        let allResults: ServerSearchResult[] = [];

        // Search in each category table
        for (const category of categories) {
          const tableName = `a_mcp_${category.category_name.replace(
            /-/g,
            "_"
          )}`;

          // Use ilike for case-insensitive search with wildcard pattern matching
          const { data: results } = await supabase
            .from(tableName)
            .select("*")
            .ilike("mcpName", `%${debouncedSearchTerm}%`)
            .limit(5);

          if (results && results.length > 0) {
            // Transform results to include category info
            const formattedResults = results.map((item: ServerItem) => ({
              id: item.id,
              name: item.mcpName || item.name || `Server ${item.id}`,
              description: item.description || "No description available",
              category: category.name,
              categorySlug: category.category_name,
              categoryId: category.id,
            }));

            allResults = [...allResults, ...formattedResults];
          }
        }

        // Limit total results to prevent overwhelming UI
        setSuggestions(allResults.slice(0, 10));
      } catch (error) {
        console.error("Error searching servers:", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchServers();
  }, [debouncedSearchTerm, supabase]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center bg-white rounded-full p-1 pl-5 shadow-md hover:shadow-lg transition-shadow">
          <Search size={20} className="text-gray-400 mr-2" />
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for servers..."
            className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 text-gray-700 py-3"
            aria-label="search for servers"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 p-2"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <Button
            type="submit"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 h-10 ml-2"
            aria-label="Search button"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Search suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-100"
        >
          <div className="text-xs text-gray-500 px-5 py-2">
            Found {suggestions.length} results
          </div>
          <div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center px-5 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search
                  size={16}
                  className="text-gray-400 mr-3 flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {suggestion.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    Category: {suggestion.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
