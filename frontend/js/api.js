/*====================================================
    LIBMAN API
    Frontend ↔ Spring Boot
====================================================*/

const BASE_URL = "http://localhost:8080/api";

/*====================================================
    HELPER REQUEST
====================================================*/

async function request(url, method = "GET", data = null) {

    const token = localStorage.getItem("token");

    const options = {

        method: method,

        headers: {
            "Content-Type": "application/json"
        }

    };

    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    if (data !== null) {
        options.body = JSON.stringify(data);
    }

    try {

        const response = await fetch(BASE_URL + url, options);

        const result = await response.json();

        if (!response.ok) {

            return {
                success: false,
                message: result.message || ("HTTP Error : " + response.status)
            };

        }

        return result;

    } catch (error) {

        console.error("API ERROR :", error);

        return {
            success: false,
            message: error.message
        };

    }

}

/*====================================================
    DASHBOARD API
====================================================*/

// Total Buku
async function getDashboardBooks() {

    const result = await request("/books");

    return result.data;

}

// Total Anggota
async function getDashboardMembers() {

    const result = await request("/members");

    return result.data;

}

// Total Peminjaman
async function getDashboardBorrowings() {

    const result = await request("/loans");

    return result.data;

}

// Total Pengembalian
async function getDashboardReturns(){

    const result = await request("/loans/late");

    return result.data;

}

/*====================================================
    BUKU
====================================================*/

// Ambil semua buku
async function getBooks(page = 0, size = 20) {

    return await request(`/books?page=${page}&size=${size}`);

}

// Ambil satu buku
async function getBook(id) {

    return await request("/books/" + id);

}
/*====================================================
    CRUD BUKU
====================================================*/

// Tambah Buku
async function addBook(book) {

    return await request("/books", "POST", book);

}

// Update Buku
async function updateBook(id, book) {

    return await request("/books/" + id, "PUT", book);

}

// Hapus Buku
async function deleteBook(id) {

    return await request("/books/" + id, "DELETE");

}

/*====================================================
    SEARCH BUKU
====================================================*/

// Cari berdasarkan judul
async function searchBooks(keyword) {

    return await request("/books/search?keyword=" + encodeURIComponent(keyword));

}

// Buku berdasarkan kategori
async function getBooksByCategory(categoryId) {

    return await request("/books/category/" + categoryId);

}

// Buku berdasarkan ISBN
async function getBookByIsbn(isbn) {

    return await request("/books/isbn/" + isbn);

}

// Buku stok tersedia
async function getAvailableBooks() {

    return await request("/books/available");

}

/*====================================================
    VALIDASI BUKU
====================================================*/

function validateBook(book) {

    if (!book.title || book.title.trim() === "") {

        alert("Judul buku wajib diisi");

        return false;

    }

    if (!book.author || book.author.trim() === "") {

        alert("Penulis wajib diisi");

        return false;

    }

    if (!book.publisher || book.publisher.trim() === "") {

        alert("Penerbit wajib diisi");

        return false;

    }

    if (!book.isbn || book.isbn.trim() === "") {

        alert("ISBN wajib diisi");

        return false;

    }

    if (!book.publicationYear) {

        alert("Tahun terbit wajib diisi");

        return false;

    }

    if (!book.stock) {

        alert("Stok wajib diisi");

        return false;

    }

    return true;

}

/*====================================================
    SIMPAN BUKU
====================================================*/

async function saveBook(book) {

    if (!validateBook(book)) {

        return;

    }

    const result = await addBook(book);

    if (result.success) {

        alert("Buku berhasil ditambahkan");

        location.reload();

    } else {

        alert(result.message);

    }

}

/*====================================================
    UPDATE DATA BUKU
====================================================*/

async function editBook(id, book) {

    if (!validateBook(book)) {

        return;

    }

    const result = await updateBook(id, book);

    if (result.success) {

        alert("Buku berhasil diperbarui");

        location.reload();

    } else {

        alert(result.message);

    }

}

/*====================================================
    HAPUS DATA
====================================================*/

async function removeBook(id) {

    const konfirmasi = confirm("Yakin ingin menghapus buku ini?");

    if (!konfirmasi) {

        return;

    }

    const result = await deleteBook(id);

    if (result.success) {

        alert("Buku berhasil dihapus");

        location.reload();

    } else {

        alert(result.message);

    }

}
/*====================================================
    CRUD ANGGOTA
====================================================*/

// Ambil semua anggota
async function getMembers(page = 0, size = 100) {

    return await request(`/members?page=${page}&size=${size}`);

}
// Ambil satu anggota
async function getMemberById(id){

    return await request(
        "/members/" + id
    );

}
// tambah anggota
async function createMember(member){

    return await request(
        "/members",
        "POST",
        member
    );

}
//update anggota
async function updateMember(id, member){

    return await request(
        "/members/" + id,
        "PUT",
        member
    );

}
//haspus anggota
async function deleteMember(id){

    return await request(
        "/members/" + id,
        "DELETE"
    );

}

/*====================================================
    SEARCH ANGGOTA
====================================================*/

// Cari anggota
async function searchMembers(keyword) {

    return await request("/members/search?keyword=" + encodeURIComponent(keyword));

}

/*====================================================
    VALIDASI ANGGOTA
====================================================*/

function validateMember(member) {

    if (!member.name || member.name.trim() === "") {

        alert("Nama anggota wajib diisi");

        return false;

    }

    if (!member.address || member.address.trim() === "") {

        alert("Alamat wajib diisi");

        return false;

    }

    if (!member.phone || member.phone.trim() === "") {

        alert("Nomor telepon wajib diisi");

        return false;

    }

    if (!member.email || member.email.trim() === "") {

        alert("Email wajib diisi");

        return false;

    }

    return true;

}
/*====================================================
    UPDATE ANGGOTA
====================================================*/

async function editMember(id, member) {

    if (!validateMember(member)) {

        return;

    }

    const result = await updateMember(id, member);

    if (result.success) {

        alert("Data anggota berhasil diperbarui");

        location.href = "anggota.html";

    } else {

        alert(result.message);

    }

}

/*====================================================
    HAPUS ANGGOTA
====================================================*/

async function removeMember(id) {

    const konfirmasi = confirm("Yakin ingin menghapus anggota ini?");

    if (!konfirmasi) {

        return;

    }

    const result = await deleteMember(id);

    if (result.success) {

        alert("Anggota berhasil dihapus");

        location.reload();

    } else {

        alert(result.message);

    }

}
/*====================================================
    CRUD PEMINJAMAN
====================================================*/

// Ambil semua data peminjaman
async function getBorrowings(page = 0, size = 20) {

    return await request(`/loans?page=${page}&size=${size}`);

}

// Ambil satu data peminjaman
async function getBorrowing(id) {

    return await request("/loans/" + id);

}

// Tambah peminjaman
async function addBorrowing(borrowing) {

    return await request("/loans", "POST", borrowing);

}

// Update peminjaman
async function updateBorrowing(id, borrowing) {

    return await request("/loans/" + id, "PUT", borrowing);

}

// Hapus peminjaman
async function deleteBorrowing(id) {

    return await request("/loans/" + id, "DELETE");

}

/*====================================================
    PENCARIAN PEMINJAMAN
====================================================*/

// Cari berdasarkan keyword
async function searchBorrowings(keyword) {

    return await request(
        "/borrowings/search?keyword=" + encodeURIComponent(keyword)
    );

}

// Cari berdasarkan anggota
async function getBorrowingsByMember(memberId) {

    return await request("/borrowings/member/" + memberId);

}

// Cari berdasarkan buku
async function getBorrowingsByBook(bookId) {

    return await request("/borrowings/book/" + bookId);

}

// Data yang belum dikembalikan
async function getActiveBorrowings() {

    return await request("/borrowings/active");

}

/*====================================================
    VALIDASI PEMINJAMAN
====================================================*/

function validateBorrowing(data) {

    if (!data.memberId) {

        alert("Silakan pilih anggota.");

        return false;

    }

    if (!data.bookId) {

        alert("Silakan pilih buku.");

        return false;

    }

    if (!data.borrowDate) {

        alert("Tanggal pinjam wajib diisi.");

        return false;

    }

    if (!data.returnDate) {

        alert("Tanggal kembali wajib diisi.");

        return false;

    }

    return true;

}

/*====================================================
    SIMPAN PEMINJAMAN
====================================================*/

async function saveBorrowing(data) {

    if (!validateBorrowing(data)) {

        return;

    }

    const result = await addBorrowing(data);

    if (result.success) {

        alert("Peminjaman berhasil disimpan.");

        location.href = "peminjaman.html";

    } else {

        alert(result.message);

    }

}

/*====================================================
    UPDATE PEMINJAMAN
====================================================*/

async function editBorrowing(id, data) {

    if (!validateBorrowing(data)) {

        return;

    }

    const result = await updateBorrowing(id, data);

    if (result.success) {

        alert("Data peminjaman berhasil diperbarui.");

        location.reload();

    } else {

        alert(result.message);

    }

}

/*====================================================
    HAPUS PEMINJAMAN
====================================================*/

async function removeBorrowing(id) {

    const konfirmasi = confirm(
        "Yakin ingin menghapus transaksi peminjaman?"
    );

    if (!konfirmasi) {

        return;

    }

    const result = await deleteBorrowing(id);

    if (result.success) {

        alert("Data peminjaman berhasil dihapus.");

        location.reload();

    } else {

        alert(result.message);

    }

}

/*====================================================
    PERPANJANG PEMINJAMAN
====================================================*/

async function extendBorrowing(id, newReturnDate) {

    return await request(
        "/borrowings/" + id + "/extend",
        "PUT",
        {
            returnDate: newReturnDate
        }
    );

}

/*====================================================
    PROSES PENGEMBALIAN
====================================================*/

async function returnBorrowing(id) {

    return await request(
        "/loans/" + id + "/return",
        "PUT"
    );

}
/*====================================================
    CRUD PENGEMBALIAN
====================================================*/

// Ambil semua data pengembalian
async function getReturns(page = 0, size = 20) {

    return await request(`/loans?page=${page}&size=${size}`);

}

// Ambil detail pengembalian
async function getReturn(id) {

    return await request("/returns/" + id);

}

// Simpan pengembalian
async function addReturn(returnData) {

    return await request("/returns", "POST", returnData);

}

// Update pengembalian
async function updateReturn(id, returnData) {

    return await request("/returns/" + id, "PUT", returnData);

}

// Hapus pengembalian
async function deleteReturn(id) {

    return await request("/returns/" + id, "DELETE");

}

/*====================================================
    VALIDASI PENGEMBALIAN
====================================================*/

function validateReturn(data){

    if(!data.borrowingId){

        alert("Data peminjaman belum dipilih.");

        return false;

    }

    if(!data.returnDate){

        alert("Tanggal pengembalian wajib diisi.");

        return false;

    }

    return true;

}

/*====================================================
    SIMPAN PENGEMBALIAN
====================================================*/

async function saveReturn(data){

    if(!validateReturn(data)){

        return;

    }

    const result = await addReturn(data);

    if(result.success){

        alert("Pengembalian berhasil diproses.");

        location.href="pengembalian.html";

    }else{

        alert(result.message);

    }

}

/*====================================================
    UPDATE PENGEMBALIAN
====================================================*/

async function editReturn(id,data){

    if(!validateReturn(data)){

        return;

    }

    const result = await updateReturn(id,data);

    if(result.success){

        alert("Pengembalian berhasil diperbarui.");

        location.reload();

    }else{

        alert(result.message);

    }

}

/*====================================================
    HAPUS PENGEMBALIAN
====================================================*/

async function removeReturn(id){

    if(!confirm("Yakin ingin menghapus data pengembalian?")){

        return;

    }

    const result = await deleteReturn(id);

    if(result.success){

        alert("Data berhasil dihapus.");

        location.reload();

    }else{

        alert(result.message);

    }

}

/*====================================================
    LAPORAN
====================================================*/

// Semua laporan
async function getReports(){

    return await request("/reports");

}

// Laporan berdasarkan tanggal
async function getReportByDate(start,end){

    return await request(`/reports?start=${start}&end=${end}`);

}

// Export PDF
async function exportPdf(){

    window.open(BASE_URL + "/reports/pdf");

}

// Export Excel
async function exportExcel(){

    window.open(BASE_URL + "/reports/excel");

}

/*====================================================
    DASHBOARD SUMMARY
====================================================*/

async function getDashboardSummary(){

    return await request("/dashboard");

}

/*====================================================
    LOGIN
====================================================*/

async function login(username,password){

    return await request("/auth/login","POST",{

        username,

        password

    });

}

/*====================================================
    LOGOUT
====================================================*/

function logout(){

    localStorage.removeItem("token");

    window.location.href="login.html";

}

/*====================================================
    TOKEN
====================================================*/

function saveToken(token){

    localStorage.setItem("token",token);

}

function getToken(){

    return localStorage.getItem("token");

}

function isLogin(){

    return getToken()!=null;

}

/*====================================================
    UTILITAS
====================================================*/

function formatDate(date){

    return new Date(date).toLocaleDateString("id-ID");

}

function formatCurrency(value){

    return new Intl.NumberFormat("id-ID",{

        style:"currency",

        currency:"IDR"

    }).format(value);

}
async function getCategories(){

    return await request("/categories");

}
async function getBookById(id){

    return await request(`/books/${id}`);

}
async function updateBook(id, book){

    return await request(
        `/books/${id}`,
        "PUT",
        book
    );

}
// ===============================
// LOAN
// ===============================

async function createLoan(data) {

    return await request("/loans", "POST", data);

}

async function getLoans() {

    return await request("/loans");

}
async function getLoanById(id){

    return await request(`/loans/${id}`);

}

async function returnLoan(id) {

    return await request(`/loans/${id}/return`, "PUT");

}

console.log("LIBMAN API Loaded Successfully");
// ======================================
// LATE LOAN
// ======================================

async function getLateLoans(){

    return await request("/loans/late");

}