document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    document
        .getElementById("memberForm")
        .addEventListener("submit", saveMember);

});

// ======================================
// SIMPAN ANGGOTA
// ======================================

async function saveMember(e) {

    e.preventDefault();

    const member = {

        fullName:
            document.getElementById("fullName").value.trim(),

        nim:
            document.getElementById("nim").value.trim(),

        studyProgram:
            document.getElementById("studyProgram").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        address:
            document.getElementById("address").value.trim(),

        active:
            document.querySelector(
            'input[name="active"]:checked'
            ).value === "true"
    };

    // Validasi sederhana
    if (
        member.fullName === "" ||
        member.nim === "" ||
        member.studyProgram === "" ||
        member.email === "" ||
        member.phone === "" ||
        member.address === ""
    ) {

        alert("Semua field wajib diisi.");
        return;

    }

    const result = await createMember(member);

    if (result.success) {

        alert("Anggota berhasil ditambahkan.");

        window.location.href = "anggota.html";

    } else {

        alert(result.message);

    }

}