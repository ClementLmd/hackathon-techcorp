import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  p: ({ children }) => <p className="leading-relaxed whitespace-pre-wrap">{children}</p>,
  ul: ({ children }) => <ul className="my-2 list-disc pl-5 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal pl-5 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="mt-3 mb-2 text-lg font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-3 mb-2 text-base font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-2 mb-1 text-sm font-semibold">{children}</h3>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium underline underline-offset-2"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`${className ?? ""} font-mono text-sm`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-muted p-3 text-sm">{children}</pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-2 py-1 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="text-sm break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
