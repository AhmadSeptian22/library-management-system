document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {

        window.location.href = "login.html";
        return;

    }

    loadMembers();

});

// ======================================
// LOAD MEMBER
// ======================================

async function loadMembers() {

    const result = await getMembers();

    if (!result.success) {

        alert(result.message);
        return;

    }

    const members = result.data.content;

    // Update Card
    updateMemberCards(members);

    const tbody = document.getElementById("memberTableBody");

    tbody.innerHTML = "";

    members.forEach(member => {

        tbody.innerHTML += `

        <tr>

            <td>${member.fullName}</td>

            <td>${member.nim}</td>

            <td>${member.studyProgram}</td>

            <td>${member.email}</td>

            <td>${member.phone}</td>

            <td>${member.address}</td>

            <td>

                <span class="${member.active ? 'status-active' : 'status-inactive'}">

                    ${member.active ? 'Aktif' : 'Non Aktif'}

                </span>

            </td>

            <td class="action-buttons">

                <button
                    class="edit-btn"
                    onclick="editMember(${member.id})"
                    title="Edit">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMemberData(${member.id})"
                    title="Hapus">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================
// UPDATE CARD
// ======================================

function updateMemberCards(members) {

    // Total Anggota
    document.getElementById("totalMembers").textContent =
        members.length;

    // Anggota Aktif
    document.getElementById("activeMembers").textContent =
        members.filter(member => member.active).length;

    // Non Aktif
    document.getElementById("inactiveMembers").textContent =
        members.filter(member => !member.active).length;

    // Anggota Baru (sementara = total anggota)
    document.getElementById("newMembers").textContent =
        members.length;

}

// ======================================
// EDIT
// ======================================

function editMember(id){

    window.location.href =
        `edit-anggota.html?id=${id}`;

}

// ======================================
// DELETE
// ======================================

async function deleteMemberData(id) {

    if (!confirm("Yakin ingin menghapus anggota?")) {
        return;
    }

    const result = await deleteMember(id);

    if (result.success) {

        alert("Anggota berhasil dihapus.");

        loadMembers();

    } else {

        alert(result.message);

    }

}

// ======================================
// SEARCH
// ======================================

async function searchMember() {

    const keyword =
        document.getElementById("searchMember").value.trim();

    if (keyword === "") {

        loadMembers();
        return;

    }

    const result = await searchMembers(keyword);

    if (!result.success) {

        alert(result.message);
        return;

    }

    const members = result.data.content;

    const tbody =
        document.getElementById("memberTableBody");

    tbody.innerHTML = "";

    members.forEach(member => {

        tbody.innerHTML += `

        <tr>

            <td>${member.fullName}</td>

            <td>${member.nim}</td>

            <td>${member.studyProgram}</td>

            <td>${member.email}</td>

            <td>${member.phone}</td>

            <td>${member.address}</td>

            <td>

                <span class="${member.active ? 'status-active' : 'status-inactive'}">

                    ${member.active ? 'Aktif' : 'Non Aktif'}

                </span>

            </td>

            <td class="action-buttons">

                <button
                    class="edit-btn"
                    onclick="editMember(${member.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteMemberData(${member.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}