// This file provides temporary type definitions for contentlayer until the actual generated types are available

declare module "contentlayer/generated" {
  export interface Blog {
    _id: string;
    _raw: {
      flattenedPath: string;
      sourceFilePath: string;
      sourceFileName: string;
      sourceFileDir: string;
      contentType: string;
    };
    type: "Blog";
    title: string;
    date: string;
    description: string;
    cover?: string;
    tags?: string[];
    published: boolean;
    body: {
      code: string;
      raw: string;
    };
    url: string;
    readingTime: {
      text: string;
      minutes: number;
      time: number;
      words: number;
    };
    slug: string;
  }

  export const allBlogs: Blog[];
}

declare module "next-contentlayer/hooks" {
  export function useMDXComponent(code: string): React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
}
