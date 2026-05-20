import fs from 'fs';
import path from 'path';

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

function parseFrontmatter(content: string): { meta: Record<string, unknown>; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const metaStr = match[1];
  const body = match[2];
  const meta: Record<string, unknown> = {};

  // Parse YAML-like frontmatter (simple, no yaml dependency needed)
  const lines = metaStr.split('\n');
  let currentKey = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Array values
    if (trimmed.startsWith('- ') && currentKey) {
      const val = trimmed.slice(2).replace(/^['"](.*)['"]$/, '$1');
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
      (meta[currentKey] as string[]).push(val);
      continue;
    }

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    currentKey = trimmed.slice(0, colonIdx).trim();
    let val = trimmed.slice(colonIdx + 1).trim();

    // Remove quotes
    val = val.replace(/^['"](.*)['"]$/, '$1');

    if (val.startsWith('[') && val.endsWith(']')) {
      meta[currentKey] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"](.*)['"]$/, '$1'));
    } else {
      meta[currentKey] = val;
    }
  }

  return { meta, body };
}

function markdownToHtml(md: string): string {
  let html = md;

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-zinc-800 dark:text-zinc-200">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-zinc-900 dark:text-zinc-100">$1</h2>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-indigo-600 dark:text-indigo-400">$1</code>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 overflow-x-auto my-4 text-sm font-mono"><code>$2</code></pre>');

  // Ordered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal mb-1">$2</li>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1">$2</li>');

  // Paragraphs (only lines that aren't already HTML)
  html = html.replace(/^(?!<[a-z/])(.+)$/gm, (match) => {
    if (match.trim()) return `<p class="mb-3 leading-relaxed">${match}</p>`;
    return match;
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 hover:underline">$1</a>');

  return html;
}

export function getBlogPosts(locale: string): BlogMeta[] {
  const blogDir = path.join(process.cwd(), 'content', 'blog', locale);

  try {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

    const posts: BlogMeta[] = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const { meta } = parseFrontmatter(content);
      posts.push({
        slug: file.replace(/\.mdx?$/, ''),
        title: (meta.title as string) || file,
        date: (meta.date as string) || '',
        tags: (meta.tags as string[]) || [],
        excerpt: (meta.excerpt as string) || '',
      });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export function getBlogPost(slug: string, locale: string): { meta: BlogMeta; content: string } | null {
  const blogDir = path.join(process.cwd(), 'content', 'blog', locale);

  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(blogDir, slug + ext);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { meta, body } = parseFrontmatter(raw);
      return {
        meta: {
          slug,
          title: (meta.title as string) || slug,
          date: (meta.date as string) || '',
          tags: (meta.tags as string[]) || [],
          excerpt: (meta.excerpt as string) || '',
        },
        content: markdownToHtml(body),
      };
    } catch {
      // try next extension
    }
  }

  return null;
}
