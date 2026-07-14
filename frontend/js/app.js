/*====================================================
    LIBMAN APP
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("LIBMAN Started");

    initializeApplication();

});

/*====================================================
    INISIALISASI
====================================================*/

function initializeApplication() {

    activateSidebar();

    detectCurrentPage();

}

/*====================================================
    DETEKSI HALAMAN
====================================================*/

function detectCurrentPage() {

    const page = window.location.pathname.split("/").pop();

    switch (page) {

    case "dashboard.html":

    loadDashboard();
    loadLateNotification();

    break;

            break;

        case "buku.html":

            loadBooks();

            break;

        case "anggota.html":

            loadMembers();

            break;

        case "peminjaman.html":

            loadBorrowings();

            break;

        case "pengembalian.html":

            loadReturns();

            break;

        case "laporan.html":

            loadReports();

            break;

        default:

            console.log("Page Loaded :", page);

    }

}

/*====================================================
    SIDEBAR
====================================================*/

function activateSidebar() {

    const current = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (href === current) {

            link.classList.add("active");

        }

    });

}

/*====================================================
    DASHBOARD
====================================================*/

async function loadDashboard() {

    console.log("Loading Dashboard...");

    try {

        const books = await getDashboardBooks();

        const members = await getDashboardMembers();

        const borrowings = await getDashboardBorrowings();

        const returns = await getDashboardReturns();

        setCardValue("totalBooks", getTotal(books));

        setCardValue("totalMembers", getTotal(members));

        setCardValue("totalBorrowings", getTotal(borrowings));

        setCardValue("totalReturns", getTotal(returns));

    }

    catch (error) {

        console.error(error);

    }

}

/*====================================================
    CARD VALUE
====================================================*/

function setCardValue(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}

/*====================================================
    TOTAL DATA
====================================================*/

function getTotal(result) {

    if (!result)

        return 0;

    if (Array.isArray(result))

        return result.length;

    if (result.content)

        return result.totalElements;

    return 0;

}

/*====================================================
    LOADING
====================================================*/

function showLoading() {

    console.log("Loading...");

}

function hideLoading() {

    console.log("Finished");

}
async function loadLateNotification(){

    const result = await getLateLoans();

    if(!result.success){
        return;
    }

    const list = document.getElementById("lateLoanList");

    const total = document.getElementById("lateLoanCount");

    if(!list || !total){
        return;
    }

    total.innerHTML = result.data.length;

    if(result.data.length === 0){

        list.innerHTML = `
            <p class="no-late">
                Tidak ada anggota yang terlambat.
            </p>
        `;

        return;
    }

    list.innerHTML = "";

    result.data.forEach(loan=>{

        list.innerHTML += `

            <div class="late-item">

                <strong>${loan.memberName}</strong><br>

                📚 ${loan.bookTitle}<br>

                📅 Jatuh Tempo :
                ${formatDate(loan.dueDate)}<br>

                💰 Denda :
                ${formatCurrency(loan.fine)}

            </div>

        `;

    });

}
