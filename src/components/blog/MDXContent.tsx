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

  // 处理表格 - 先提取完整表格并转换为HTML表格
  let processedContent = markdownContent;
  const tableRegex = /^\|(.*\|)+\n\|([-:\|]+\|)+\n(\|(.*\|)+\n?)+/gm;

  processedContent = processedContent.replace(tableRegex, (table) => {
    const rows = table.trim().split("\n");

    // 提取表头行
    const headerRow = rows[0];
    const headerCells = headerRow.split("|").slice(1, -1);
    const headerHtml = headerCells
      .map((cell) => `<th class="border px-4 py-2">${cell.trim()}</th>`)
      .join("");

    // 跳过分隔行（第二行）

    // 处理表格内容行
    const bodyRows = rows.slice(2);
    const bodyHtml = bodyRows
      .map((row) => {
        if (!row.trim()) return ""; // 跳过空行
        const cells = row.split("|").slice(1, -1);
        const cellsHtml = cells
          .map((cell) => `<td class="border px-4 py-2">${cell.trim()}</td>`)
          .join("");
        return `<tr>${cellsHtml}</tr>`;
      })
      .join("");

    return `<table class="table-auto border-collapse w-full my-6">
      <thead class="bg-gray-100 dark:bg-gray-800">
        <tr>${headerHtml}</tr>
      </thead>
      <tbody>
        ${bodyHtml}
      </tbody>
    </table>`;
  });

  // 基本解析，处理标题、段落、列表等
  const formattedContent = processedContent
    // 处理代码块
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="language-$1"><code>$2</code></pre>'
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
    // 处理图片
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    // 处理段落 (排除已处理的HTML标签)
    .replace(/^(?!<[hotli]).+$/gm, "<p>$&</p>");

  return (
    <div
      className="mdx-content prose prose-lg dark:prose-invert"
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
