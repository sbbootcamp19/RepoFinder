const TEMPLATE_PROJECT = document.querySelector("#TEMPLATE_PROJECT");
const projectContainer = document.querySelector(".project-container");
const searchButton = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");

async function getGitHubRepos(search) {
    try {
        const url = "https://api.github.com/search/repositories?q=";
        const response = await fetch(`${url}${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const json = await response.json();
        console.log(json);
        return json.items;
    } finally {}
}

function formatDate(dte) {
    const d = new Date(dte);
    let year = d.getFullYear();
    let month = (1 + d.getMonth()).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
  
    return `${month}/${day}/${year}`;
}

function loadRepos(repos) {
    const firstFive = repos.slice(0, 5);

    for (let repo of firstFive) {
        let html = TEMPLATE_PROJECT.innerHTML;

        html = html.replace("{{image}}", repo.owner.avatar_url);
        html = html.replace("{{items.full_name}}", repo.full_name);
        html = html.replace("{{items.created_at}}", formatDate(repo.created_at));
        html = html.replace("{{items.url}}", repo.html_url);
        html = html.replace("{{items.description}}", repo.description);
        html = html.replace("{{items.stargazers_count}}", repo.stargazers_count);
        html = html.replace("{{items.forks}}", repo.forks);
        html = html.replace("{{items.watchers_count}}", repo.watchers_count);
        html = html.replace("{{item.language}}", repo.language);
        html = html.replace("{{item.visibility}}", repo.visibility);
        html = html.replace("{{item.organizations_url}}", repo.owner.organizations_url);
        
        projectContainer.innerHTML += html;
    }
}

(() => {
    searchButton.addEventListener("click", async (evt) => {
        projectContainer.innerHTML = "<h1 class='loading'>Loading...</h1>";
        const repos = await getGitHubRepos(searchInput.value);

        projectContainer.innerHTML = "";
        loadRepos(repos);
    });

})();