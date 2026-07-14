document.addEventListener("DOMContentLoaded", async () => {

    if (!isLogin()) {

        window.location.href = "login.html";
        return;

    }

    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        alert("ID anggota tidak ditemukan.");

        window.location.href = "anggota.html";

        return;

    }

    await loadMember(id);

    document
        .getElementById("memberForm")
        .addEventListener("submit", function(e){

            e.preventDefault();

            updateMemberData(id);

        });

});

// ======================================
// LOAD MEMBER
// ======================================

async function loadMember(id){

    const result = await getMemberById(id);

    if(!result.success){

        alert(result.message);

        return;

    }

    const member = result.data;

    document.getElementById("fullName").value = member.fullName;

    document.getElementById("nim").value = member.nim;

    document.getElementById("studyProgram").value = member.studyProgram;

    document.getElementById("email").value = member.email;

    document.getElementById("phone").value = member.phone;

    document.getElementById("address").value = member.address;

    document.querySelector(`input[name="active"][value="${member.active}"]`).checked = true;

}

// ======================================
// UPDATE MEMBER
// ======================================

async function updateMemberData(id){

    const member = {

        fullName:
            document.getElementById("fullName").value,

        nim:
            document.getElementById("nim").value,

        studyProgram:
            document.getElementById("studyProgram").value,

        email:
            document.getElementById("email").value,

        phone:
            document.getElementById("phone").value,

        address:
            document.getElementById("address").value,

        active:
            document.querySelector('input[name="active"]:checked').value === "true"

    };

    const result = await updateMember(id, member);

    if(result.success){

        alert("Data anggota berhasil diperbarui.");

        window.location.href = "anggota.html";

    }else{

        alert(result.message);

    }

}