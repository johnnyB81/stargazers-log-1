const repoList = document.querySelector("#repo-list");
const repoStatus = document.querySelector("#repo-status");

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

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list.");
    }

    repoList.replaceChildren(...repositories.map(createRepositoryCard));
    repoStatus.textContent = repositories.length
      ? `${repositories.length} repositories`
      : "No repositories to show yet.";
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    repoStatus.textContent = "Could not load repositories. Please try again later.";
    repoStatus.classList.add("is-error");
  }
}

loadRepositories();
