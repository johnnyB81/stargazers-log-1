const repoList = document.querySelector("#repo-list");
const repoStatus = document.querySelector("#repo-status");
const repoSearch = document.querySelector("#repo-search");
let repositories = [];

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repo-card";

  const heading = document.createElement("h2");
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = `${repository.owner}/${repository.name}`;
  heading.append(link);

  const description = document.createElement("p");
  description.textContent = repository.description;

  const metadata = document.createElement("div");
  metadata.className = "repo-meta";

  const language = document.createElement("span");
  language.textContent = repository.language;
  metadata.append(language);

  const starredDate = document.createElement("time");
  starredDate.dateTime = repository.starredAt;
  starredDate.textContent = `Starred ${repository.starredAt}`;
  metadata.append(starredDate);

  item.append(heading, description, metadata);
  return item;
}

function renderRepositories() {
  const query = repoSearch.value.trim().toLocaleLowerCase();
  const matches = repositories.filter((repository) => {
    const searchableText = [
      repository.name,
      repository.owner,
      repository.description,
      repository.language,
    ].join(" ").toLocaleLowerCase();

    return searchableText.includes(query);
  });

  repoList.replaceChildren(...matches.map(createRepositoryCard));

  if (matches.length === 0 && query) {
    repoStatus.textContent = "No repositories match your search.";
  } else if (matches.length === 0) {
    repoStatus.textContent = "No repositories to show yet.";
  } else if (query) {
    repoStatus.textContent = `${matches.length} of ${repositories.length} repositories`;
  } else {
    repoStatus.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;
  }
}

repoSearch.addEventListener("input", renderRepositories);

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Repository data must be a list.");
    }

    repositories = data;
    repoSearch.disabled = false;
    renderRepositories();
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    repoStatus.textContent = "Could not load repositories. Please try again later.";
    repoStatus.classList.add("is-error");
  }
}

loadRepositories();
