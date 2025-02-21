import { Hono } from "hono";
import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";
import { config } from "../lib/config";

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JioSaavan UnOfficial API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <style>
        .markdown-body {
            box-sizing: border-box;
            min-width: 200px;
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        @media (max-width: 767px) {
            .markdown-body {
                padding: 15px;
            }
        }
        body {
            background-color: #f6f8fa;
        }
        .container {
            background-color: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            margin: 20px auto;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
        }
        code {
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eaecef;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #24292e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="markdown-body">
            <div class="header">
                <h1>JioSaavan UnOfficial API Documentation</h1>
            </div>
            {{content}}
        </div>
    </div>
</body>
</html>
`;

const docs = new Hono();

docs.get("/docs", async (c) => {
  try {
    // Read the markdown file
    const mdPath = join(process.cwd(), "read.md");
    const markdown = readFileSync(mdPath, "utf-8");

    // Convert markdown to HTML using marked
    const content = marked.parse(markdown);

    // Replace the placeholder with actual base URL from config
    const html = template
      .replace("{{content}}", content as string)
      .replace(/https:\/\/your-api-base-url\.com/g, config.urls.siteUrl);

    // Send HTML response
    return c.html(html);
  } catch {
    c.status(500);
    return c.json({
      status: "Failed",
      message: "Failed to load documentation",
      data: null,
    });
  }
});

// Redirect root to docs
docs.get("/", (c) => c.redirect("/docs"));

export default docs;
