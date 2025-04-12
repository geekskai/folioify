import React from "react";
import { useMemo } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

interface UseMDXComponentProps {
  components?: Record<string, React.ComponentType<any>>;
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
    const MDXComponent = ({ components = {} }: UseMDXComponentProps = {}) => {
      const [Content, setContent] = React.useState<React.ComponentType | null>(
        null
      );

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
              setContent(() => result.default);
            }
          } catch (error) {
            console.error("Error compiling MDX:", error);
            if (isMounted) {
              setContent(() => () => (
                <div className="mdx-error">
                  <h3>MDX渲染错误</h3>
                  <pre>{code}</pre>
                </div>
              ));
            }
          }
        };

        compileMDX();

        return () => {
          isMounted = false;
        };
      }, [code, components]);

      // 显示加载状态或内容
      if (!Content) {
        return (
          <div className="mdx-loading">
            <p>加载MDX内容...</p>
          </div>
        );
      }

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
