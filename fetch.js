const form = document.forms[0];

form.addEventListener("submit", submitForm);

function submitForm(event) {
    event.preventDefault();

    const usernameInput = event.target["githubuser"];
    const username = usernameInput.value.trim();
    usernameInput.value = "";

    if (username == "" || username.includes(" ")) {
        showError("El nombre de usuario contiene espacios.")
        return;
    }

    loadUsernameData(username);
};

function loadUsernameData(username) {
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showError(`El usuario ${username} no existe.`);
                return;
            }
            const username = data.login;
            const avatar = data.avatar_url;
            const bio = (data.bio != null) ? data.bio : "";
            const url = data.html_url;

            var template = document.createElement('template');
            template.innerHTML = `
            <tr>
                <td class="username">${username}</td>
                <td class="avatar"><img src="${avatar}"></td>
                <td class="bio">${bio}</td>
                <td class="url">${url}</td>
            </tr>
            `.trim();
            const userInfoNode = template.content.firstChild;
            const formBody = document.querySelector("#myTable tbody");

            formBody.insertBefore(userInfoNode, formBody.firstChild);
        })
        .catch(error => showError(`El usuario ${username} no existe.`));
}

function showError(msg) {
    const error = document.querySelector("#error");
    error.textContent = msg;
    error.style.display = "inline";
    setTimeout(() => {
        error.style.display = "none";
        error.textContent = "";
    }, 5000);
}