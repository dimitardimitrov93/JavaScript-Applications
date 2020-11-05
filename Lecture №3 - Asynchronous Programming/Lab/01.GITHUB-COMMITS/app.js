function loadCommits() {
    const usernameInputElement = document.getElementById('username');
    const repoInputElement = document.getElementById('repo');
    const commitsUlElement = document.getElementById('commits');

    const username = usernameInputElement.value;
    const repository = repoInputElement.value;

    usernameInputElement.value = '';
    repoInputElement.value = '';
    commitsUlElement.innerHTML = '';

    fetch(`https://api.github.com/repos/${username}/${repository}/commits`)
        .then(res => {
            if (res.status !== 200) throw new Error(`${res.status} (${res.statusText})`);
            return res.json();
        })
        .then(data => {
            data.forEach(line => {
                commitsUlElement.innerHTML += `<li>${line.commit.author.name}: ${line.commit.message}</li>`;
            })
        })
        .catch(err => {
            commitsUlElement.innerHTML += `<li>${err}</li>`;
        });
}