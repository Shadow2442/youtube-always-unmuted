'use strict';

const repoApi = 'https://api.github.com/repos/Shadow2442/youtube-always-unmuted';

function setCounter(name, value) {
  for (const element of document.querySelectorAll(`[data-counter="${name}"]`)) {
    element.textContent = value;
  }
}

function compactNumber(value) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  return response.json();
}

async function loadProjectCounters() {
  try {
    const [repository, release, issues] = await Promise.all([
      fetchJson(repoApi),
      fetchJson(`${repoApi}/releases/latest`),
      fetchJson(`${repoApi}/issues?state=open&per_page=100`),
    ]);

    const downloads = release.assets.reduce((total, asset) => total + asset.download_count, 0);
    const feedback = issues.filter((issue) => !issue.pull_request).length;

    setCounter('stars', compactNumber(repository.stargazers_count));
    setCounter('downloads', compactNumber(downloads));
    setCounter('release', release.tag_name);
    setCounter('feedback', compactNumber(feedback));
  } catch {
    setCounter('stars', '0');
    setCounter('downloads', '0');
    setCounter('release', 'v1.0.0');
    setCounter('feedback', '0');
  }
}

loadProjectCounters();
