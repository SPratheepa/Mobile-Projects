const token =
    localStorage.getItem(
        "access_token"
    );

if(!token){

    window.location.href =
        "login.html";
}

async function loadRooms(){

    const response =
        await apiRequest(
            "/api/rooms/my-rooms",
            "POST",
            {
                page:1,
                per_page:20,
                search:"",
                sort_by:"cr_on",
                sort_order:"desc",
                filters:{}
            },
            true
        );

    const container =
        document.getElementById(
            "rooms"
        );

    if(
        !response ||
        !response.success
    ){

        container.innerHTML = `
            <div class="empty-state">
                Failed to load rooms
            </div>
        `;

        return;
    }

    const rooms =
        response.data.items || [];

    if(
        rooms.length === 0
    ){

        container.innerHTML = `
            <div class="empty-state">
                <h2>No Rooms Yet</h2>
                <br>
                <p>Create your first escape room.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    rooms.forEach(room => {

        container.innerHTML += `
            <div class="room-card">

                <div class="room-title">
                    ${room.name || "Untitled Room"}
                </div>

                <div class="room-description">
                    ${room.description || ""}
                </div>

                <div class="room-footer">

                    <span class="room-status">
                        Draft
                    </span>

                    <button
                        class="room-action">

                        Edit

                    </button>

                </div>

            </div>
        `;
    });
}

async function logout(){

    try{

        await apiRequest(
            "/api/auth/logout",
            "POST",
            {},
            true
        );

    }catch(err){

        console.log(err);
    }

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );

    window.location.href =
        "login.html";
}

loadRooms();