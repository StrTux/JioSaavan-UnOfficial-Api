import { Hono } from "hono";
import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";
import { config } from "../lib/config";

const docs = new Hono();

docs.get("/", async (c) => {
  try {
    const mdPath = join(process.cwd(), "read.md");
    const markdown = readFileSync(mdPath, "utf-8");
    const content = await marked.parse(markdown);
    
    return c.html(generateDocsHtml(content));
  } catch (error) {
    c.status(500);
    return c.json({ 
      status: "Failed",
      message: "Failed to load documentation",
      data: null
    });
  }
});

function generateDocsHtml(content: string) {
  return `<!DOCTYPE html>
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
        body { background-color: #f6f8fa; }
        .container {
            background-color: white;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="markdown-body">
            ${content.replace(/https:\/\/your-api-base-url\.com/g, config.urls.siteUrl)}
        </div>
    </div>
</body>
</html>`;
}

export { docs }; 