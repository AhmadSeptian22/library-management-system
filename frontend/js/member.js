document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {

        window.location.href = "login.html";
        return;

    }

    loadMembers();

});

async function loadMembers() {

    const result = await getMembers();

    if (!result.success) {

        alert(result.message);
        return;

    }

    const tbody = document.getElementById("memberTableBody");

    tbody.innerHTML = "";

    result.data.content.forEach(member => {

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

function editMember(id){

    window.location.href =
        `edit-anggota.html?id=${id}`;

}

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