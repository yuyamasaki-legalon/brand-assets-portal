import { LfCheck, LfCopy } from "@legalforce/aegis-icons";
import {
  Blockquote,
  Checkbox,
  Code,
  Icon,
  IconButton,
  Link,
  Table,
  TableContainer,
  Tag,
  Text,
  Tooltip,
} from "@legalforce/aegis-react";
import { Children, isValidElement, useCallback, useMemo, useRef, useState } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { createSlugger } from "../utils/slugify";
import styles from "./MarkdownRenderer.module.css";

interface MarkdownRendererProps {
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively extract plain text from React children. */
function extractText(children: React.ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);
      if (isValidElement(child) && child.props) {
        return extractText((child.props as { children?: React.ReactNode }).children);
      }
      return "";
    })
    .join("");
}

// ---------------------------------------------------------------------------
// HeadingWithAnchor
// ---------------------------------------------------------------------------

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingVariants = {
  1: "title.large",
  2: "title.medium",
  3: "title.small",
  4: "label.large",
  5: "label.medium",
  6: "label.small",
} as const;

const headingTag: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const headingLevelClass: Record<HeadingLevel, string> = {
  1: styles.headingGroupH1,
  2: styles.headingGroupH2,
  3: styles.headingGroupH3,
  4: styles.headingGroupSmall,
  5: styles.headingGroupSmall,
  6: styles.headingGroupSmall,
};

function HeadingWithAnchor({
  level,
  children,
  slugger,
}: {
  level: HeadingLevel;
  children: React.ReactNode;
  slugger: (text: string) => string;
}) {
  const text = extractText(children);
  const id = slugger(text);

  return (
    <div id={id} className={`${styles.headingGroup} ${headingLevelClass[level]}`}>
      <Text as={headingTag[level]} variant={headingVariants[level]} style={{ margin: 0 }}>
        {children}
      </Text>
      <a href={`#${id}`} aria-label={`Link to ${text}`} className={styles.anchorLink}>
        #
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CodeBlock (with copy button & language tag)
// ---------------------------------------------------------------------------

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-secure context, denied permission) — silent fallback
    }
  }, [children]);

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeBlockOverlayLeft}>
        {language && (
          <Tag size="small" color="neutral">
            {language}
          </Tag>
        )}
      </div>
      <div className={styles.codeBlockOverlayRight}>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <IconButton aria-label="Copy code" variant="plain" size="small" onClick={handleCopy}>
            <Icon size="small" color={copied ? "success" : undefined}>
              {copied ? <LfCheck /> : <LfCopy />}
            </Icon>
          </IconButton>
        </Tooltip>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        wrapLongLines
        customStyle={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowX: "auto",
          paddingTop: "var(--aegis-space-xLarge)",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared (non-heading) component overrides
// ---------------------------------------------------------------------------

const sharedComponents: Partial<Components> = {
  // Paragraph – wider bottom margin for readability
  p: ({ children }) => (
    <Text as="p" variant="body.medium" style={{ marginBottom: "var(--aegis-space-medium)" }}>
      {children}
    </Text>
  ),

  // Links
  a: ({ href, children }) => (
    <Link href={href ?? "#"} color="information">
      {children}
    </Link>
  ),

  // Code – inline only (fenced blocks are handled by the `pre` override below)
  code: ({ children }) => (
    <Code style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}>{children}</Code>
  ),

  // Pre – fenced code blocks: extract language & content from hast node, render via CodeBlock
  pre: ({ node }) => {
    // Access the hast AST directly to bypass the code component override
    const codeNode = node?.children?.[0];
    if (codeNode?.type === "element" && codeNode.tagName === "code") {
      const classNames = codeNode.properties?.className;
      const langClass = Array.isArray(classNames) ? String(classNames[0] || "") : "";
      const match = /language-(\w+)/.exec(langClass);
      const language = match ? match[1] : "";
      const text = codeNode.children?.map((c) => ("value" in c ? c.value : "")).join("") || "";
      return <CodeBlock language={language}>{text.replace(/\n$/, "")}</CodeBlock>;
    }
    return <pre />;
  },

  // Lists
  ul: ({ children, className }) => {
    const isTaskList = className?.includes("contains-task-list");
    return (
      <ul
        style={{
          paddingLeft: isTaskList ? 0 : "var(--aegis-space-large)",
          marginBottom: "var(--aegis-space-small)",
          listStyleType: isTaskList ? "none" : "disc",
        }}
      >
        {children}
      </ul>
    );
  },
  ol: ({ children }) => (
    <ol
      style={{
        paddingLeft: "var(--aegis-space-large)",
        marginBottom: "var(--aegis-space-small)",
        listStyleType: "decimal",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children, className }) => {
    const isTask = className?.includes("task-list-item");
    return (
      <li
        style={{
          marginBottom: "var(--aegis-space-xSmall)",
          ...(isTask ? { display: "flex", alignItems: "flex-start", gap: "var(--aegis-space-xSmall)" } : {}),
        }}
      >
        {isTask ? (
          children
        ) : (
          <Text as="span" variant="body.medium">
            {children}
          </Text>
        )}
      </li>
    );
  },

  // GFM Checkbox
  input: ({ type, checked }) => {
    if (type === "checkbox") {
      return <Checkbox size="small" checked={checked ?? false} readOnly style={{ flexShrink: 0 }} />;
    }
    return <input type={type} />;
  },

  // Blockquote
  blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,

  // Table
  table: ({ children }) => (
    <TableContainer style={{ marginBottom: "var(--aegis-space-medium)" }}>
      <Table>{children}</Table>
    </TableContainer>
  ),
  thead: ({ children }) => <Table.Head>{children}</Table.Head>,
  tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
  tr: ({ children }) => <Table.Row>{children}</Table.Row>,
  th: ({ children }) => <Table.Cell as="th">{children}</Table.Cell>,
  td: ({ children }) => <Table.Cell as="td">{children}</Table.Cell>,

  // Horizontal rule
  hr: () => <hr className={styles.hr} />,

  // Inline formatting
  strong: ({ children }) => (
    <strong>
      <Text variant="body.medium.bold">{children}</Text>
    </strong>
  ),
  em: ({ children }) => <em>{children}</em>,

  // Images – figure with optional caption
  img: ({ src, alt }) => (
    <figure className={styles.figure}>
      <img
        src={src}
        alt={alt ?? ""}
        style={{
          maxWidth: "100%",
          borderRadius: "var(--aegis-radius-large)",
          border: "1px solid var(--aegis-color-border-default)",
          display: "block",
        }}
      />
      {alt && (
        <figcaption className={styles.figcaption}>
          <Text variant="body.small" color="subtle">
            {alt}
          </Text>
        </figcaption>
      )}
    </figure>
  ),
};

// ---------------------------------------------------------------------------
// MarkdownRenderer
// ---------------------------------------------------------------------------

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  // Fresh slugger every render so IDs stay deterministic.
  // Stored in a ref so mdComponents can remain stable across renders.
  const sluggerRef = useRef(createSlugger());
  sluggerRef.current = createSlugger();

  const mdComponents = useMemo<Components>(() => {
    const headingComponents: Partial<Components> = {};
    for (const lvl of [1, 2, 3, 4, 5, 6] as const) {
      const tag = `h${lvl}` as const;
      headingComponents[tag] = ({ children }) => (
        <HeadingWithAnchor level={lvl} slugger={sluggerRef.current}>
          {children}
        </HeadingWithAnchor>
      );
    }
    return { ...sharedComponents, ...headingComponents };
  }, []);

  return (
    <article className={styles.article}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
};
