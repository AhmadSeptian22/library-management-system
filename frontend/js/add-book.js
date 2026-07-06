document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    loadCategories();

    document
        .getElementById("bookForm")
        .addEventListener("submit", saveBook);

});

async function loadCategories() {

    const result = await getCategories();

    if (!result.success) {
        alert(result.message);
        return;
    }

    const select = document.getElementById("categoryId");

    result.data.forEach(category => {

        select.innerHTML += `
            <option value="${category.id}">
                ${category.name}
            </option>
        `;

    });

}

async function saveBook(e) {

    e.preventDefault();

    const book = {

        title: document.getElementById("title").value,

        author: document.getElementById("author").value,

        publisher: document.getElementById("publisher").value,

        isbn: document.getElementById("isbn").value,

        publicationYear: Number(
            document.getElementById("publicationYear").value
        ),

        stock: Number(
            document.getElementById("stock").value
        ),

        categoryId: Number(
            document.getElementById("categoryId").value
        )

    };

    const result = await addBook(book);

    if(result.success){

        alert("Buku berhasil ditambahkan.");

        window.location.href = "buku.html";

    }else{

        alert(result.message);

    }

}