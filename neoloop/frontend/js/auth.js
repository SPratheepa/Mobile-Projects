function saveTokens(data) {

    localStorage.setItem(
        "access_token",
        data.access_token
    );

    localStorage.setItem(
        "refresh_token",
        data.refresh_token
    );
}

function logout() {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );

    window.location.href =
        "../pages/login.html";
}

function isLoggedIn() {

    return !!localStorage.getItem(
        "access_token"
    );
}