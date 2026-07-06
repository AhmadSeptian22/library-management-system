document.addEventListener("DOMContentLoaded", async () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    // Ambil ID dari URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("ID Buku tidak ditemukan");
        window.location.href = "buku.html";
        return;
    }

    // Load kategori
    await loadCategories();

    // Load data buku
    await loadBook(id);

    // Submit update
    document
        .getElementById("bookForm")
        .addEventListener("submit", function(e){

            e.preventDefault();

            updateBookData(id);

        });

});


// ===============================
// Load Semua Kategori
// ===============================

async function loadCategories(){

    const result = await getCategories();

    if(!result.success){

        alert(result.message);

        return;

    }

    const select = document.getElementById("categoryId");

    select.innerHTML = `<option value="">-- Pilih Kategori --</option>`;

    result.data.forEach(category=>{

        select.innerHTML += `
            <option value="${category.id}">
                ${category.name}
            </option>
        `;

    });

}


// ===============================
// Load Data Buku
// ===============================

async function loadBook(id){

    const result = await getBookById(id);

    if(!result.success){

        alert(result.message);

        return;

    }

    const book = result.data;

    document.getElementById("title").value = book.title;

    document.getElementById("author").value = book.author;

    document.getElementById("publisher").value = book.publisher;

    document.getElementById("isbn").value = book.isbn;

    document.getElementById("publicationYear").value =
        book.publicationYear;

    document.getElementById("stock").value =
        book.stock;

    document.getElementById("categoryId").value =
        book.categoryId;

}



// ===============================
// Update Buku
// ===============================

async function updateBookData(id){

    const book = {

        title:
            document.getElementById("title").value,

        author:
            document.getElementById("author").value,

        publisher:
            document.getElementById("publisher").value,

        isbn:
            document.getElementById("isbn").value,

        publicationYear:
            Number(document.getElementById("publicationYear").value),

        stock:
            Number(document.getElementById("stock").value),

        categoryId:
            Number(document.getElementById("categoryId").value)

    };

    const result = await updateBook(id, book);

    if(result.success){

        alert("Data buku berhasil diperbarui.");

        window.location.href="buku.html";

    }else{

        alert(result.message);

    }

}