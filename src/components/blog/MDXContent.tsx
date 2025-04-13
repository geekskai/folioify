"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

// 定义MDX组件接口
interface MDXContentProps {
  code: string;
}

// 自定义MDX组件
const components = {
  // 图片组件
  img: ({
    src,
    alt,
    ...props
  }: {
    src?: string;
    alt?: string;
    [key: string]: unknown;
  }) => (
    <Image
      src={src || ""}
      alt={alt || ""}
      width={700}
      height={350}
      className="rounded-lg my-6"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 700px, 700px"
      {...props}
    />
  ),

  // 链接组件
  a: ({
    href,
    children,
    ...props
  }: {
    href?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    if (href?.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }

    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },

  // 代码块组件
  code: ({
    className,
    children,
    ...props
  }: {
    className?: string;
    children?: string;
    [key: string]: unknown;
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (language) {
      return (
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          PreTag="div"
          className="rounded-md my-4"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

// 简单的MDX内容渲染器
const SimpleMDXRenderer = ({ code }: MDXContentProps) => {
  // 提取Markdown内容（去除frontmatter）
  const markdownContent = code.replace(/^---[\s\S]*?---/, "").trim();

  // 处理表格的辅助函数
  const processTable = (tableContent: string) => {
    const lines = tableContent.trim().split("\n");
    let html = '<table class="mdx-table">';

    // 处理表头
    if (lines.length > 0) {
      const headerCells = lines[0]
        .split("|")
        .filter((cell) => cell.trim() !== "");
      html += "<thead><tr>";
      headerCells.forEach((cell) => {
        html += `<th>${cell.trim()}</th>`;
      });
      html += "</tr></thead>";
    }

    // 跳过分隔行
    let bodyStartIndex = 2;
    if (lines.length > 1 && lines[1].includes("---")) {
      bodyStartIndex = 2;
    } else {
      bodyStartIndex = 1; // 没有分隔行的情况
    }

    // 处理表格正文
    if (lines.length > bodyStartIndex) {
      html += "<tbody>";
      for (let i = bodyStartIndex; i < lines.length; i++) {
        const cells = lines[i].split("|").filter((cell) => cell.trim() !== "");
        if (cells.length > 0) {
          html += "<tr>";
          cells.forEach((cell) => {
            html += `<td>${cell.trim()}</td>`;
          });
          html += "</tr>";
        }
      }
      html += "</tbody>";
    }

    html += "</table>";
    return html;
  };

  // 构建正则表达式匹配表格
  const tableRegex =
    /\|(.+)\|[\r\n]+\|(?:\s*[-:]+[-:|\s]*)+\|[\r\n]+((?:\|(?:.+)\|[\r\n])+)/g;

  // 首先提取所有表格并为它们分配唯一ID
  const tables: Record<string, string> = {};
  let tableId = 0;
  const contentWithTablePlaceholders = markdownContent.replace(
    tableRegex,
    (match) => {
      const id = `TABLE_PLACEHOLDER_${tableId++}`;
      tables[id] = processTable(match);
      return id;
    }
  );

  // 图片的正则表达式，捕获更多图片格式
  const imageRegex = /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g;

  // 基本解析，处理标题、段落、列表等
  let formattedContent = contentWithTablePlaceholders
    // 处理图片 - 改进匹配
    .replace(
      imageRegex,
      '<div class="image-container"><img src="$2" alt="$1" title="$3" /></div>'
    )

    // 处理代码块 - 保持现有改进
    .replace(
      /```(\w+)?\s*\n([\s\S]*?)```/g,
      '<div class="code-block"><pre class="language-$1"><code>$2</code></pre></div>'
    )

    // 处理标题
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")

    // 处理列表
    .replace(/^\* (.+)$/gm, "<li>$1</li>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")

    // 处理粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")

    // 处理链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

    // 处理段落 - 不要影响HTML标签
    .replace(/^(?!<[holi\|]).+$/gm, "<p>$&</p>");

  // 最后，把表格的占位符替换回已处理的HTML表格
  Object.keys(tables).forEach((id) => {
    formattedContent = formattedContent.replace(id, tables[id]);
  });

  return (
    <div
      className="mdx-content prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

// 带有加载状态的主MDX组件
export function MDXContent({ code }: MDXContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!code) {
    return (
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500">无法加载内容。请稍后再试。</p>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
    );
  }

  return <SimpleMDXRenderer code={code} />;
}
