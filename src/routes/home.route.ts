import { Hono } from "hono";

import { config } from "../lib/config";

export const home = new Hono().get("/", (c) =>
  c.html(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>JioSaavn UnOfficial API</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="icon" type="image/png" href="favicon.png" />
		<meta name="title" content="JioSaavn UnOfficial API" />
		<meta name="description" content="JioSaavn UnOfficial API by rajput-hemant@github" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="${config.urls.siteUrl}" />
		<meta property="og:title" content="JioSaavn UnOfficial API" />
		<meta property="og:description" content="JioSaavn UnOfficial API by rajput-hemant@github" />
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="${config.urls.siteUrl}" />
		<meta property="twitter:title" content="JioSaavn UnOfficial API by rajput-hemant@github" />
		<meta
			property="twitter:description"
			content="JioSaavn UnOfficial API by rajput-hemant@github"
		/>
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			tailwind.config = {
				theme: {
					extend: {
						colors: {
							'custom-purple': '#6800c7',
							'custom-pink': '#9333ea4d'
						}
					}
				}
			}
		</script>
	</head>

	<style>
		.no-select {
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}
		.no-select:focus {
			outline: none !important;
		}

		/* https://github.com/rajput-hemant/react-template-vite/blob/master/src/styles/layout.css */
		.layout {
			background-image: radial-gradient(
					hsla(0, 0%, 84%, 0.15) 1px,
					transparent 0
				),
				radial-gradient(hsla(0, 0%, 65%, 0.1) 1px, transparent 0);
			background-size: 50px 50px;
			background-position: 0 0, 25px 25px;
			-webkit-animation: slide 2s linear infinite;
			animation: slide 4s linear infinite;
		}

		@keyframes slide {
			100% {
				background-position: 50px 0, 125px 25px;
			}
		}

		.cards:hover > .card::after {
			opacity: 1;
		}

		.card::before {
			background: radial-gradient(
				800px circle at var(--mouse-x) var(--mouse-y),
				rgba(0, 0, 0, 0.03),
				transparent 40%
			);
			z-index: 3;
		}

		.card::after {
			background: radial-gradient(
				600px circle at var(--mouse-x) var(--mouse-y),
				rgba(0, 0, 0, 0.1),
				transparent 40%
			);
			z-index: 1;
		}

		.card {
			transition: transform 0.2s ease-in-out;
		}

		.card:hover {
			transform: translateY(-5px);
		}

		.custom-gradient {
			background: linear-gradient(to right, #6800c7, #9333ea4d);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	</style>

	<body
		class="layout m-0 flex min-h-screen flex-col items-center justify-center bg-white p-0 text-black"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div class="text-center mb-16">
				<h1
					class="custom-gradient text-4xl md:text-6xl font-bold leading-tight mb-4"
				>
					JioSaavn UnOfficial API
				</h1>
				<p class="text-gray-600 text-lg mb-6">
					An Unofficial wrapper for the JioSaavn API
				</p>
				<span
					class="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-black text-white"
				>
					Unofficial
				</span>
			</div>

			<div
				class="cards grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
			>
				<a
					href="${config.urls.docsUrl}"
					target="_blank"
					rel="noopener noreferrer"
					class="card relative flex flex-col rounded-2xl border-2 border-black/20 bg-white p-6 transition-all duration-300"
				>
					<div class="flex flex-col h-full">
						<span
							class="mb-4 inline-block rounded-full border border-black/20 bg-white px-4 py-1.5 text-sm font-semibold text-black/80"
						>
							Documentation
						</span>

						<h2 class="text-xl font-bold text-black mb-3">
							API Reference
						</h2>

						<p class="text-gray-600 flex-grow">
							Check out the comprehensive documentation to learn how to use the JioSaavn API effectively.
						</p>
					</div>
				</a>

				<a
					href="https://github.com/StrTux/JioSaavan-UnOfficial-Api"
					target="_blank"
					rel="noopener noreferrer"
					class="card relative flex flex-col rounded-2xl border-2 border-black/20 bg-white p-6 transition-all duration-300"
				>
					<div class="flex flex-col h-full">
						<span
							class="mb-4 inline-block rounded-full border border-black/20 bg-white px-4 py-1.5 text-sm font-semibold text-black/80"
						>
							Open Source
						</span>

						<h2 class="text-xl font-bold text-black mb-3">
							GitHub Repository
						</h2>

						<p class="text-gray-600 flex-grow">
							Explore the source code, contribute, and help improve the API for everyone.
						</p>
					</div>
				</a>

				<a
					href="https://github.com/StrTux/JioSaavan-UnOfficial-Api/issues"
					target="_blank"
					rel="noopener noreferrer"
					class="card relative flex flex-col rounded-2xl border-2 border-black/20 bg-white p-6 transition-all duration-300"
				>
					<div class="flex flex-col h-full">
						<span
							class="mb-4 inline-block rounded-full border border-black/20 bg-white px-4 py-1.5 text-sm font-semibold text-black/80"
						>
							Contribute
						</span>

						<h2 class="text-xl font-bold text-black mb-3">
							Report Issues
						</h2>

						<p class="text-gray-600 flex-grow">
							Found a bug or have a feature request? Let us know and help make the API better.
						</p>
					</div>
				</a>

				<a
					href="https://github.com/strtux"
					target="_blank"
					rel="noopener noreferrer"
					class="card relative flex flex-col rounded-2xl border-2 border-black/20 bg-white p-6 transition-all duration-300"
				>
					<div class="flex flex-col h-full">
						<span
							class="mb-4 inline-block rounded-full border border-black/20 bg-white px-4 py-1.5 text-sm font-semibold text-black/80"
						>
							Author
						</span>

						<h2 class="text-xl font-bold text-black mb-3">
							Ashish Tiwari
						</h2>

						<p class="text-gray-600 flex-grow">
							Check out other projects and contributions by the creator of this API.
						</p>
					</div>
				</a>
			</div>
		</div>

		<footer class="w-full text-center py-8 mt-auto">
			<p class="text-gray-600 text-sm">
				© ${new Date().getFullYear()} JioSaavn API. All rights reserved.
			</p>
		</footer>

		<script>
			document.getElementsByClassName("cards")[0].onmousemove = (e) => {
				for (const card of document.getElementsByClassName("card")) {
					const rect = card.getBoundingClientRect(),
						x = e.clientX - rect.left,
						y = e.clientY - rect.top;

					card.style.setProperty("--mouse-x", \`\${x}px\`);
					card.style.setProperty("--mouse-y", \`\${y}px\`);
				}
			};
		</script>
	</body>
</html>`)
);
