document.addEventListener("DOMContentLoaded", async () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    await loadMembers();
    await loadBooks();
    document
    .getElementById("memberSelect")
    .addEventListener("change", showMemberInfo);

});


// ===================================
// Data sementara
// ===================================
let members = [];
let selectedBooks = [];


// ===================================
// Load Member
// ===================================

async function loadMembers() {

    const result = await getMembers();
    console.log(result);

    if (!result.success) {

        alert(result.message);

        return;

    }

    members = result.data.content;
    console.log(members);

    const select = document.getElementById("memberSelect");

    select.innerHTML = `
        <option value="">-- Pilih Anggota --</option>
    `;

    members.forEach(member => {

        select.innerHTML += `
            <option value="${member.id}">
                ${member.fullName}
            </option>
        `;

    });

}


// ===================================
// Load Buku
// ===================================

async function loadBooks() {

    const result = await getBooks();

    if (!result.success) {
        alert(result.message);
        return;
    }

    const select = document.getElementById("bookSelect");

    select.innerHTML = `<option value="">Pilih Buku</option>`;

    result.data.content.forEach(book => {

        select.innerHTML += `
            <option value="${book.id}">
                ${book.title}
            </option>
        `;

    });

}


// ===================================
// Tambah Buku
// ===================================

function addBook() {

    const select = document.getElementById("bookSelect");

    const id = Number(select.value);

    if (!id) {
        alert("Pilih buku.");
        return;
    }

    if (selectedBooks.includes(id)) {
        alert("Buku sudah dipilih.");
        return;
    }

    selectedBooks.push(id);

    renderBooks();

}


// ===================================
// Render Table
// ===================================

async function renderBooks() {

    const tbody = document.getElementById("loanBookBody");

    tbody.innerHTML = "";

    const books = await getBooks();

    selectedBooks.forEach(id => {

        const book = books.data.content.find(b => b.id === id);

        tbody.innerHTML += `

        <tr>

            <td>${book.title}</td>

            <td>${book.categoryName}</td>

            <td>${book.stock}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="removeBook(${id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("totalBook").innerHTML =
        selectedBooks.length;

}


// ===================================
// Remove Buku
// ===================================

function removeBook(id) {

    selectedBooks =
        selectedBooks.filter(bookId => bookId != id);

    renderBooks();

}


// ===================================
// Submit Loan
// ===================================

async function saveLoan() {

    const loan = {

        memberId: Number(document.getElementById("memberSelect").value),

        bookId: Number(document.getElementById("bookSelect").value),

        loanDate: document.getElementById("loanDate").value,

        dueDate: document.getElementById("dueDate").value

    };

    if (!loan.memberId) {

        alert("Pilih anggota.");

        return;

    }

    if (!loan.bookId) {

        alert("Pilih buku.");

        return;

    }

    const result = await createLoan(loan);

    if (result.success) {

        alert("Peminjaman berhasil.");

        location.reload();

    } else {

        alert(result.message);

    }

}


// ===================================
// showMemberInfo
// ===================================

function showMemberInfo() {

    const memberId =
        Number(document.getElementById("memberSelect").value);

    const member =
        members.find(m => m.id === memberId);

    if (!member) return;

    document.getElementById("memberName").textContent =
        member.fullName;

    document.getElementById("memberNim").textContent =
        member.nim;

    document.getElementById("memberStudy").textContent =
        member.studyProgram;

    const status =
        document.getElementById("memberStatus");

    if (member.active) {

        status.textContent = "Aktif";
        status.className = "badge success";

    } else {

        status.textContent = "Non Aktif";
        status.className = "badge danger";

    }

}