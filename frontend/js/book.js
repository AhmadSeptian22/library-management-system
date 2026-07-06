document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {

        window.location.href = "login.html";

        return;

    }

    loadBooks();

});

async function loadBooks() {

    const result = await getBooks();

    if (!result.success) {

    alert(result?.message || "Gagal mengambil data buku");

    return;


    }

    const tbody = document.getElementById("bookTableBody");

    tbody.innerHTML = "";

    result.data.content.forEach(book => {

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

function editBook(id){

    window.location.href = `edit-buku.html?id=${id}`;

}
// ===============================
// DELETE BOOK
// ===============================

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