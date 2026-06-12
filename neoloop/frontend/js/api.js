// js/api.js

const API_BASE_URL = "http://127.0.0.1:5000";

async function apiRequest(
    endpoint,
    method = "GET",
    payload = null,
    auth = false
) {

    const headers = {
        "Content-Type": "application/json"
    };

    if (auth) {

        const token = localStorage.getItem(
            "access_token"
        );

        if (token) {
            headers["Authorization"] =
                `Bearer ${token}`;
        }
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method,
            headers,
            body: payload
                ? JSON.stringify(payload)
                : null
        }
    );

    const data = await response.json();

    console.log(
        "API Response:",
        response.status,
        data
    );

    return data;
}