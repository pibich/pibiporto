import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Resolve a possibly-relative URL against a base; leave absolute URLs as-is. */
function resolve(url: string | undefined, base?: string): string | undefined {
  if (!url || !base) return url;
  if (/^(https?:|mailto:|#|data:)/i.test(url)) return url;
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

/**
 * Renders trusted Markdown (project documentation written by the admin, or a
 * repo README) into the terminal theme. Raw HTML is intentionally NOT enabled
 * (no rehype-raw), so the content is safe from embedded markup.
 *
 * `baseUrl` resolves relative image/link paths (e.g. `./assets/logo.png` in a
 * GitHub README) against the repo's raw content host.
 */
export function Markdown({
  children,
  baseUrl,
}: {
  children: string;
  baseUrl?: string;
}) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const resolved = resolve(href, baseUrl);
            const external = !!resolved && /^https?:\/\//.test(resolved);
            return (
              <a
                href={resolved}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            const url = typeof src === "string" ? resolve(src, baseUrl) : src;
            // biome-ignore lint/performance/noImgElement: remote README image, next/image not warranted
            return <img src={url} alt={alt ?? ""} />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
