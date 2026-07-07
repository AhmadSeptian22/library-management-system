document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {

        window.location.href = "login.html";

        return;

    }

    loadBooks();

});

// ======================================
// LOAD BOOKS
// ======================================

async function loadBooks() {

    const result = await getBooks();

    if (!result.success) {

        alert(result?.message || "Gagal mengambil data buku");

        return;

    }

    const books = result.data.content;

    // Update Card
    updateBookCards(books);
    await updateBorrowedCard();

    const tbody = document.getElementById("bookTableBody");

    tbody.innerHTML = "";

    books.forEach(book => {

        tbody.innerHTML += `

        <tr>

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.categoryName}</td>

            <td>${book.stock}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBook(${book.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBookData(${book.id})">

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

function updateBookCards(books) {

    document.getElementById("totalBooks").textContent =
        books.length;

    document.getElementById("availableBooks").textContent =
        books.filter(book => book.stock > 0).length;

    document.getElementById("emptyStockBooks").textContent =
        books.filter(book => book.stock === 0).length;

}

// ======================================
// TOTAL DIPINJAM
// ======================================

async function updateBorrowedCard() {

    const result = await getLoans();

    if (!result.success) return;

    const borrowed =
        result.data.content.filter(
            loan => loan.status === "BORROWED"
        ).length;

    document.getElementById("borrowedBooks").textContent =
        borrowed;

}

// ======================================
// EDIT
// ======================================

function editBook(id){

    window.location.href = `edit-buku.html?id=${id}`;

}

// ======================================
// DELETE
// ======================================

async function deleteBookData(id){

    const yakin = confirm(
        "Yakin ingin menghapus buku ini?"
    );

    if(!yakin){
        return;
    }

    const result = await deleteBook(id);

    if(result.success){

        alert("Buku berhasil dihapus.");

        loadBooks();

    }else{

        alert(result.message);

    }

}
// ======================================
// SEARCH
// ======================================

async function searchBook() {

    const keyword =
        document.getElementById("searchBook").value.trim();

    if (keyword === "") {

        loadBooks();
        return;

    }

    const result = await searchBooks(keyword);

    if (!result.success) {

        alert(result.message);
        return;

    }

    const books = result.data.content;

    const tbody =
        document.getElementById("bookTableBody");

    tbody.innerHTML = "";

    books.forEach(book => {

        tbody.innerHTML += `

        <tr>

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.categoryName}</td>

            <td>${book.stock}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editBook(${book.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBookData(${book.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}