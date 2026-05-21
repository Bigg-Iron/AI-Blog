/**
 * AI Navigator Blog — app.js
 * Shared data + interactive logic (filtering, charts, tables)
 */

// ─────────────────────────────────────────────
// POSTS DATA
// Each post: { id, title, date, excerpt, tags, readTime, href }
// ─────────────────────────────────────────────
const POSTS = [
  // ── Placeholder posts (no article page yet) ──────────────────────────────
  /*
  {
    id: 1,
    title: "Comparing the Top AI Assistants in 2025: A Hands-On Breakdown",
    date: "2025-03-12",
    excerpt:
      "I spent two weeks running identical prompts through GPT-4o, Claude 3.7, Gemini Advanced, and Mistral. Here's what I found — with data.",
    tags: ["AI Tools", "Data"],
    readTime: "8 min read",
    href: "post.html",
  },
  {
    id: 2,
    title: "My First Month Using AI for Everything: Lessons Learned",
    date: "2025-02-01",
    excerpt:
      "What happens when you offload every task you can to AI? I kept a detailed log. Some results were surprising, others humbling.",
    tags: ["Experiments", "Opinions"],
    readTime: "6 min read",
    href: "#",
  },
  {
    id: 3,
    title: "How I Built a Research Pipeline With Claude and n8n",
    date: "2025-02-20",
    excerpt:
      "Step-by-step walkthrough of the automated workflow I use to summarise papers, extract insights, and store them in Notion.",
    tags: ["Tutorials", "AI Tools"],
    readTime: "10 min read",
    href: "#",
  },
  {
    id: 4,
    title: "The Prompt Engineering Playbook I Actually Use",
    date: "2025-03-05",
    excerpt:
      "Not another listicle of tips. These are the patterns I return to daily — with before/after examples for each.",
    tags: ["Tutorials"],
    readTime: "7 min read",
    href: "#",
  },
  {
    id: 5,
    title: "AI-Generated Code in Production: 6 Months Later",
    date: "2025-04-18",
    excerpt:
      "We've been shipping AI-assisted code since October. Here's an honest accounting: what worked, what broke, and what we changed.",
    tags: ["Experiments", "Opinions"],
    readTime: "9 min read",
    href: "#",
  },
  {
    id: 6,
    title: "Token Economics: Understanding Costs Before You Scale",
    date: "2025-04-30",
    excerpt:
      "A practical cost model for anyone building on top of LLM APIs — complete with a breakdown table and interactive estimator.",
    tags: ["Data", "AI Tools"],
    readTime: "5 min read",
    href: "#",
  },
  */
  // ── Published articles ────────────────────────────────────────────────────
  {
    id: 7,
    title: "2026 AI API Pricing Breakdown: Claude, Gemini, GPT-5 & Grok Compared",
    date: "2026-05-08",
    excerpt:
      "Full pricing table for every major closed-model API as of May 2026 — including the batch and caching discounts that can cut your bill by 95%.",
    tags: ["Data", "AI Tools"],
    readTime: "6 min read",
    href: "post-api-pricing-2026.html",
  },
  {
    id: 8,
    title: "API vs Self-Hosting: A Real-World Cost Analysis for 2026",
    date: "2026-05-08",
    excerpt:
      "When does running your own LLM on cloud GPUs actually beat managed APIs? We worked through a verified GCP quote, full TCO, and the break-even math.",
    tags: ["Data", "Experiments"],
    readTime: "10 min read",
    href: "post-self-hosting-vs-api.html",
  },
  {
    id: 9,
    title: "7 Developer Tools Worth Knowing: Zapier, Composio, ngrok, Convex, Pi, Vercel & Lambda",
    date: "2026-05-08",
    excerpt:
      "A practical overview of seven tools reshaping modern dev stacks — from no-code automation and AI agent integrations to GPU cloud infrastructure for training and inference.",
    tags: ["Tutorials", "AI Tools"],
    readTime: "11 min read",
    href: "post-dev-tools-overview.html",
  },
  {
    id: 10,
    title: "The AI Agent Stack Explained: Tools, Skills, Plugins, MCP & A2A",
    date: "2026-05-09",
    excerpt:
      "The vocabulary of AI agents is evolving fast. A clear breakdown of every layer — from atomic tools and MCP servers to skills, plugins, and Google's A2A interoperability protocol.",
    tags: ["AI Tools", "Tutorials"],
    readTime: "10 min read",
    href: "post-agent-stack.html",
  },
  {
    id: 11,
    title: "The Rise of Local AI: How On-Device Models Are Reshaping the Landscape",
    date: "2026-05-10",
    excerpt:
      "Cloud AI still dominates the headlines, but local models are quietly winning the infrastructure war. A macro look at why local AI is rising, who's driving it, and what it means for the industry.",
    tags: ["AI Tools", "Data"],
    readTime: "9 min read",
    href: "post-local-ai-trends.html",
  },
  {
    id: 12,
    title: "Google I/O 2026: The AI Event You Cannot Miss — May 19",
    date: "2026-05-15",
    excerpt:
      "Google I/O 2026 kicks off May 19. Here's every reason you should be watching: Gemini 4, Project Astra smart glasses, Android 17, and the agentic AI revolution.",
    tags: ["AI Tools"],
    readTime: "6 min read",
    href: "google-io-2026.html",
  },
  {
    id: 13,
    title: "Google I/O 2026: Welcome to the Agentic Era",
    date: "2026-05-19",
    excerpt:
      "Google I/O 2026 was less a product showcase and more a declaration of intent: Google is betting everything on agentic AI — software that doesn't just answer questions, but acts on your behalf.",
    tags: ["AI Tools"],
    readTime: "12 min read",
    href: "post-google-io-2026-recap.html",
  },
];

// Tag → CSS modifier map
const TAG_CLASS = {
  "AI Tools":    "tag--ai-tools",
  "Experiments": "tag--experiments",
  "Opinions":    "tag--opinions",
  "Data":        "tag--data",
  "Tutorials":   "tag--tutorials",
};

function tagHTML(tag, clickable = false) {
  const cls = TAG_CLASS[tag] || "";
  const extra = clickable ? ` data-tag="${tag}"` : "";
  return `<span class="tag ${cls}"${extra}>${tag}</span>`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─────────────────────────────────────────────
// POST CARD RENDERER
// ─────────────────────────────────────────────
/** Returns true if the post was published within the last 14 days */
function isNew(post) {
  const published = new Date(post.date);
  const now = new Date();
  const diffDays = (now - published) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

function renderCard(post) {
  const newBadge = isNew(post) ? `<span class="badge--new">New</span>` : "";
  return `
    <a class="post-card" href="${post.href}">
      <div class="post-card__tags">
        ${post.tags.map(t => tagHTML(t)).join("")}
        ${newBadge}
      </div>
      <div class="post-card__title">${post.title}</div>
      <div class="post-card__excerpt">${post.excerpt}</div>
      <div class="post-card__meta">
        <span>${formatDate(post.date)}</span>
        <span class="post-card__meta-dot"></span>
        <span>${post.readTime}</span>
      </div>
    </a>
  `;
}

// ─────────────────────────────────────────────
// HOME PAGE — TAG FILTERING
// ─────────────────────────────────────────────
function initHomePage() {
  const grid = document.getElementById("post-grid");
  const filterBar = document.getElementById("tag-filter");
  if (!grid) return;

  let activeTag = "All";

  // Collect all unique tags
  const allTags = ["All", ...new Set(POSTS.flatMap(p => p.tags))];

  // Build filter bar
  filterBar.innerHTML =
    `<span class="tag-bar__label">Filter:</span>` +
    allTags
      .map(
        t =>
          `<button class="tag ${t === "All" ? "active" : ""} ${TAG_CLASS[t] || ""}"
                   data-filter="${t}">${t}</button>`
      )
      .join("");

  function renderGrid() {
    const filtered =
      activeTag === "All"
        ? [...POSTS]
        : POSTS.filter(p => p.tags.includes(activeTag));

    // Sort newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="no-results"><p>No posts tagged "${activeTag}" yet.</p></div>`;
    } else {
      grid.innerHTML = filtered.map(renderCard).join("");
    }
  }

  filterBar.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    activeTag = btn.dataset.filter;
    // update active state
    filterBar.querySelectorAll("[data-filter]").forEach(b =>
      b.classList.toggle("active", b.dataset.filter === activeTag)
    );
    renderGrid();
  });

  renderGrid();
}

// ─────────────────────────────────────────────
// NEWSLETTER SIGNUP (Formspree or compatible POST endpoint)
// ─────────────────────────────────────────────
// 1. Create a form at https://formspree.io (free tier is enough for a personal blog).
// 2. Copy the id from the form URL: https://formspree.io/f/abcdxyz → set formspreeId: "abcdxyz"
//    Or set submitUrl to the full https://formspree.io/f/... URL (overrides formspreeId).
// 3. In Formspree, confirm the form email and optionally turn off the default reCAPTCHA
//    for a smoother UX on static sites.
//
// If both submitUrl and formspreeId are null, submits still “succeed” locally (toast only)
// so the site works offline; check the browser console for a hint to wire up Formspree.
const NEWSLETTER = {
  submitUrl: null,
  formspreeId: "xbdwpynw",
  toastDurationMs: 5000,
  submittingLabel: "Subscribing…",
  successMessage: "✓ You're in — thanks for subscribing!",
  /** Shown in Formspree dashboard / notification email */
  emailSubject: "New subscriber — AI Navigator blog",
};

function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const toast = document.getElementById("newsletter-toast");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const defaultBtnLabel = submitBtn ? submitBtn.textContent : "";

  function newsletterEndpoint() {
    if (NEWSLETTER.submitUrl) return NEWSLETTER.submitUrl.trim();
    if (NEWSLETTER.formspreeId) {
      const id = String(NEWSLETTER.formspreeId).trim();
      return id ? `https://formspree.io/f/${id}` : null;
    }
    return null;
  }

  function showToast(message, isError) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("toast--error", Boolean(isError));
    toast.classList.add("show");
    clearTimeout(showToast._hideTimer);
    showToast._hideTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.remove("toast--error");
    }, NEWSLETTER.toastDurationMs);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"], input[name="email"]');
    if (!input) return;
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    const email = input.value.trim();
    if (!email) return;

    const url = newsletterEndpoint();
    if (!url) {
      console.info(
        "[Newsletter] Set NEWSLETTER.formspreeId or NEWSLETTER.submitUrl in app.js to send signups to Formspree."
      );
      input.value = "";
      showToast(NEWSLETTER.successMessage, false);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = NEWSLETTER.submittingLabel;
    }

    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("_subject", NEWSLETTER.emailSubject);

      const res = await fetch(url, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON body */
      }

      if (res.ok) {
        input.value = "";
        showToast(NEWSLETTER.successMessage, false);
      } else {
        const errMsg =
          (typeof data.error === "string" && data.error) ||
          (data.errors &&
            Object.values(data.errors)
              .flat()
              .filter(Boolean)
              .join(" ")) ||
          `Something went wrong (${res.status}). Try again later.`;
        showToast(errMsg, true);
      }
    } catch {
      showToast("Network error — check your connection and try again.", true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultBtnLabel;
      }
    }
  });
}

// ─────────────────────────────────────────────
// SORTABLE DATA TABLE
// ─────────────────────────────────────────────
function initSortableTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  let sortCol = null;
  let sortAsc = true;

  const headers = table.querySelectorAll("th[data-col]");
  const tbody = table.querySelector("tbody");

  function getVal(row, col) {
    const cell = row.querySelector(`td[data-col="${col}"]`);
    return cell ? cell.dataset.val ?? cell.textContent.trim() : "";
  }

  function doSort(col) {
    if (sortCol === col) {
      sortAsc = !sortAsc;
    } else {
      sortCol = col;
      sortAsc = true;
    }

    const rows = [...tbody.querySelectorAll("tr")];
    rows.sort((a, b) => {
      const av = getVal(a, col);
      const bv = getVal(b, col);
      const an = parseFloat(av);
      const bn = parseFloat(bv);
      if (!isNaN(an) && !isNaN(bn)) return sortAsc ? an - bn : bn - an;
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    rows.forEach(r => tbody.appendChild(r));

    headers.forEach(h => {
      h.classList.toggle("sorted", h.dataset.col === col);
      const icon = h.querySelector(".sort-icon");
      if (icon && h.dataset.col === col) {
        icon.textContent = sortAsc ? "↑" : "↓";
      } else if (icon) {
        icon.textContent = "↕";
      }
    });
  }

  headers.forEach(h => h.addEventListener("click", () => doSort(h.dataset.col)));
}

// ─────────────────────────────────────────────
// CHART HELPERS (Chart.js assumed loaded)
// ─────────────────────────────────────────────
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 12, padding: 16, font: { size: 12 } } },
    tooltip: { bodyFont: { size: 12 }, titleFont: { size: 13, weight: "bold" } },
  },
};

function chartColors(n) {
  const palette = [
    "#2563eb", "#16a34a", "#d97706", "#9333ea",
    "#e11d48", "#0891b2", "#ea580c", "#4f46e5",
  ];
  return palette.slice(0, n);
}

function buildBarChart(canvasId, { labels, datasets, title }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: datasets.map((d, i) => ({
        ...d,
        backgroundColor: d.backgroundColor ?? chartColors(datasets.length)[i],
        borderRadius: 5,
        borderSkipped: false,
      })),
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        title: title ? { display: true, text: title, font: { size: 13, weight: "600" } } : undefined,
      },
      scales: {
        y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

function buildRadarChart(canvasId, { labels, datasets }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = chartColors(datasets.length);
  return new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: datasets.map((d, i) => ({
        ...d,
        backgroundColor: (d.backgroundColor ?? colors[i]) + "22",
        borderColor: d.borderColor ?? colors[i],
        borderWidth: 2,
        pointBackgroundColor: d.borderColor ?? colors[i],
        pointRadius: 4,
      })),
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { stepSize: 2, font: { size: 10 }, backdropColor: "transparent" },
          grid: { color: "#e5e7eb" },
          pointLabels: { font: { size: 11 } },
        },
      },
    },
  });
}

function buildLineChart(canvasId, { labels, datasets }) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = chartColors(datasets.length);
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: datasets.map((d, i) => ({
        ...d,
        borderColor: d.borderColor ?? colors[i],
        backgroundColor: (d.borderColor ?? colors[i]) + "18",
        fill: d.fill ?? true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        y: { beginAtZero: true, grid: { color: "#f3f4f6" }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

// ─────────────────────────────────────────────
// INIT ON DOM READY
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initNewsletter();
  // Per-page chart/table init is called inline in each post page
});
