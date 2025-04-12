import React from "react";
import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

interface MDXComponentProps {
  components?: Record<string, React.ComponentType<Record<string, unknown>>>;
}

/**
 * 将MDX代码字符串转换为可渲染的React组件
 */
export function useMDXComponent(code: string) {
  const Component = useMemo(() => {
    if (!code || typeof code !== "string") {
      console.warn("Invalid MDX code provided to useMDXComponent");
      return () => null;
    }

    // 创建一个MDX组件包装器
    const MDXComponent: React.FC<MDXComponentProps> = ({ components = {} }) => {
      const [Content, setContent] =
        React.useState<React.ComponentType<MDXComponentProps> | null>(null);

      // 在客户端使用useEffect编译MDX
      React.useEffect(() => {
        let isMounted = true;

        const compileMDX = async () => {
          try {
            const result = await evaluate(code, {
              ...runtime,
              baseUrl: window.location.origin,
              development: process.env.NODE_ENV !== "production",
            });

            if (isMounted) {
              // 使用类型断言确保正确处理结果
              const ContentComponent =
                result.default as React.ComponentType<MDXComponentProps>;
              setContent(() => ContentComponent);
            }
          } catch (error) {
            console.error("Error compiling MDX:", error);
            if (isMounted) {
              const ErrorComponent: React.FC<MDXComponentProps> = () => (
                <div className="mdx-error">
                  <h3>MDX渲染错误</h3>
                  <pre>{code}</pre>
                </div>
              );
              ErrorComponent.displayName = "MDXErrorContent";
              setContent(() => ErrorComponent);
            }
          }
        };

        compileMDX();

        return () => {
          isMounted = false;
        };
      }, [components]);

      // 显示加载状态或内容
      if (!Content) {
        return (
          <div className="mdx-loading">
            <p>加载MDX内容...</p>
          </div>
        );
      }

      // 渲染MDX内容
      return (
        <MDXProvider components={components}>
          <Content components={components} />
        </MDXProvider>
      );
    };

    MDXComponent.displayName = "MDXContent";
    return MDXComponent;
  }, [code]);

  return Component;
}

export default useMDXComponent;
