document.addEventListener("DOMContentLoaded", async () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

await loadMembers();
await loadBooks();

document
.getElementById("bookSearch")
.addEventListener("keyup", searchBook);

document
.getElementById("memberSearch")
.addEventListener("keyup", searchMember);

});


// ===================================
// Data sementara
// ===================================
let members = [];
let books = [];
let selectedBooks = [];/////////// ini di edit 
let selectedBook = null;    
let selectedMember = null;



// ===================================
// Load Member
// ===================================

async function loadMembers(){

    const result = await getMembers();

    if(!result.success){

        alert(result.message);

        return;

    }

    members = result.data.content;

}

function searchMember(){

    const keyword =
        document
        .getElementById("memberSearch")
        .value
        .toLowerCase();

    const box =
        document.getElementById("memberResult");

    if(keyword==""){

        box.style.display="none";

        return;

    }

    const data =
        members.filter(member=>

            member.fullName
            .toLowerCase()
            .includes(keyword)

            ||

            member.nim
            .toLowerCase()
            .includes(keyword)

        );

    renderMemberResult(data);

}

function renderMemberResult(data){

    const box =
        document.getElementById("memberResult");

    box.innerHTML="";

    if(data.length===0){

        box.style.display="none";

        return;

    }

    box.style.display="block";

    data.forEach(member=>{

        box.innerHTML+=`

        <div class="autocomplete-item"

            onclick="chooseMember(${member.id})">

            <strong>${member.fullName}</strong>

            <small>

                ${member.nim}

                • ${member.studyProgram}

            </small>

        </div>

        `;

    });

}
function chooseMember(id){

    selectedMember =
        members.find(member => member.id === id);

    if(!selectedMember){
        return;
    }

    document.getElementById("memberSearch").value =
        selectedMember.fullName;

    document.getElementById("memberResult").style.display =
        "none";

    document.getElementById("memberName").textContent =
        selectedMember.fullName;

    document.getElementById("memberNim").textContent =
        selectedMember.nim;

    document.getElementById("memberStudy").textContent =
        selectedMember.studyProgram;

    const status =
        document.getElementById("memberStatus");

    if(selectedMember.active){

        status.textContent = "Aktif";
        status.className = "badge success";

    }else{

        status.textContent = "Non Aktif";
        status.className = "badge danger";

    }

}


// ===================================
// Load Buku
// ===================================

async function loadBooks(){

    const result = await getBooks();

    if(!result.success){

        alert(result.message);

        return;

    }

    books = result.data.content;

}

// ===================================
// Search Buku
// ===================================
function searchBook(){

    const keyword =
        document
        .getElementById("bookSearch")
        .value
        .toLowerCase();

    const box =
        document.getElementById("bookResult");

    if(keyword==""){

        box.style.display="none";

        return;

    }

    const data =
        books.filter(book=>

            book.title
            .toLowerCase()
            .includes(keyword)

            ||

            book.author
            .toLowerCase()
            .includes(keyword)

        );

    renderBookResult(data);

}

function renderBookResult(data){

    const box = document.getElementById("bookResult");

    box.innerHTML = "";

    data.forEach(book=>{

        box.innerHTML += `
            <div
                class="autocomplete-item"
                onclick="pilihBuku(${book.id})">

                ${book.title}

            </div>
        `;

    });

    box.style.display="block";

}

function pilihBuku(id){

    const book = books.find(b => b.id === id);

    selectedBookId = id;

    document.getElementById("bookSearch").value = book.title;

    document.getElementById("bookResult").style.display = "none";

}

function chooseBook(id){

    selectedBook =
        books.find(book=>book.id===id);

    document.getElementById("bookSearch").value =
        selectedBook.title;

    document.getElementById("bookResult").style.display =
        "none";

    renderSelectedBook();

}
function renderSelectedBook(){

    const tbody =
        document.getElementById("loanBookBody");

    tbody.innerHTML = `

    <tr>

        <td>${selectedBook.title}</td>

        <td>${selectedBook.categoryName}</td>

        <td>${selectedBook.stock}</td>

        <td>

            <button
                class="delete-btn"
                onclick="removeSelectedBook()">

                <i class="fa-solid fa-trash"></i>

            </button>

        </td>

    </tr>

    `;

    document.getElementById("totalBook").innerHTML = 1;

}
function removeSelectedBook(){

    selectedBook = null;

    document.getElementById("bookSearch").value = "";

    document.getElementById("loanBookBody").innerHTML = "";

    document.getElementById("totalBook").innerHTML = 0;

}


// ===================================
// Tambah Buku
// ===================================

function addBook(){

    const id = selectedBookId;

    if(!id){

        alert("Pilih buku.");

        return;

    }

    if(selectedBooks.includes(id)){

        alert("Buku sudah dipilih.");

        return;

    }

    selectedBooks.push(id);

    selectedBookId = null;

    document.getElementById("bookSearch").value = "";

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

if(selectedMember == null){

    alert("Pilih anggota.");

    return;

}

const memberId = selectedMember.id;

    if (selectedBooks.length === 0) {

        alert("Tambahkan minimal satu buku.");
        return;

    }

    const loan = {

        memberId: memberId,

        bookIds: selectedBooks,

        loanDate:
            document.getElementById("loanDate").value,

        dueDate:
            document.getElementById("dueDate").value

    };

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

function showMemberInfo(){

    if(!selectedMember) return;

    document.getElementById("memberName").innerHTML =
        selectedMember.fullName;

    document.getElementById("memberNim").innerHTML =
        selectedMember.nim;

    document.getElementById("memberStudy").innerHTML =
        selectedMember.studyProgram;

    const status =
        document.getElementById("memberStatus");

    if(selectedMember.active){

        status.innerHTML="Aktif";

        status.className="badge success";

    }else{

        status.innerHTML="Non Aktif";

        status.className="badge danger";

    }

}