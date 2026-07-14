// ======================================================
// REPORT.JS
// Library Management System
// ======================================================

let books = [];
let members = [];
let loans = [];

let borrowChart = null;
let returnChart = null;
let bookChart = null;
let statusChart = null;
let memberChart = null;

// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    await initReport();

});

// ======================================================
// INIT
// ======================================================

async function initReport() {

    await loadData();

    updateCards();

    renderTable();

    renderBookChart();

    await renderStatusChart();

    renderMemberChart();

    initModal();

}

// ======================================================
// LOAD DATA
// ======================================================

async function loadData() {

    try {

        const [
            bookResult,
            memberResult,
            loanResult
        ] = await Promise.all([

            getBooks(),
            getMembers(),
            getLoans()

        ]);

        books = [];
        members = [];
        loans = [];

        if (bookResult.success) {

            books = bookResult.data.content || [];

        }

        if (memberResult.success) {

            members = memberResult.data.content || [];

        }

        if (loanResult.success) {

            loans = loanResult.data.content || [];

        }

    } catch (e) {

        console.error(e);

        alert("Gagal mengambil data laporan.");

    }

}

// ======================================================
// UPDATE CARD
// ======================================================

function updateCards() {

    document.getElementById("totalBooks").textContent =
        books.length;

    document.getElementById("totalMembers").textContent =
        members.length;

    document.getElementById("totalLoans").textContent =
        loans.length;

    document.getElementById("totalReturns").textContent =
        loans.filter(
            loan => loan.status === "RETURNED"
        ).length;

}

function renderTable(data = loans) {

    const tbody =
        document.getElementById("reportTableBody");

    tbody.innerHTML = "";

    if (data.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="8" style="text-align:center">

                Tidak ada data.

            </td>

        </tr>

        `;

        return;

    }

    data.forEach(loan => {

        let badge = "";

        switch (loan.status) {

            case "BORROWED":

                badge = `
                    <span class="badge warning">
                        Dipinjam
                    </span>
                `;

                break;

            case "RETURNED":

                badge = `
                    <span class="badge success">
                        Dikembalikan
                    </span>
                `;

                break;

            case "LATE":

                badge = `
                    <span class="badge danger">
                        Terlambat
                    </span>
                `;

                break;

            default:

                badge = `
                    <span class="badge">
                        ${loan.status}
                    </span>
                `;

        }

        tbody.innerHTML += `

        <tr>

            <td>${loan.id}</td>

            <td>${loan.memberName}</td>

            <td>${loan.bookTitle}</td>

            <td>${formatDate(loan.loanDate)}</td>

            <td>

                ${
                    loan.returnDate
                        ? formatDate(loan.returnDate)
                        : "-"
                }

            </td>

            <td>${badge}</td>

            <td>

                Rp ${Number(
                    loan.fine || 0
                ).toLocaleString("id-ID")}

            </td>

            <td>

                <button
                    class="btn-primary"
                    onclick="showDetail(${loan.id})">

                    Detail

                </button>

            </td>

        </tr>

        `;

    });

}
// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date)
        .toLocaleDateString("id-ID", {

            day: "2-digit",
            month: "long",
            year: "numeric"

        });

}
// ======================================================
// DETAIL MODAL
// ======================================================

function showDetail(id) {

    const loan = loans.find(l => l.id == id);

    if (!loan) {

        alert("Data tidak ditemukan.");

        return;

    }

    document.getElementById("detailId").textContent =
        loan.id;

    document.getElementById("detailMember").textContent =
        loan.memberName;

    document.getElementById("detailBook").textContent =
        loan.bookTitle;

    document.getElementById("detailLoanDate").textContent =
        formatDate(loan.loanDate);

    document.getElementById("detailDueDate").textContent =
        formatDate(loan.dueDate);

    document.getElementById("detailReturnDate").textContent =
        loan.returnDate
            ? formatDate(loan.returnDate)
            : "-";

    document.getElementById("detailStatus").textContent =
        loan.status;

    document.getElementById("detailFine").textContent =
        "Rp " +
        Number(loan.fine || 0)
            .toLocaleString("id-ID");

    document
        .getElementById("detailModal")
        .style.display = "flex";

}

// ======================================================
// INIT MODAL
// ======================================================

function initModal() {

    const modal =
        document.getElementById("detailModal");

    document
        .getElementById("closeModal")
        .onclick = () => {

            modal.style.display = "none";

        };

    document
        .getElementById("closeDetailBtn")
        .onclick = () => {

            modal.style.display = "none";

        };

    window.addEventListener("click", function (e) {

        if (e.target === modal) {

            modal.style.display = "none";

        }

    });

}

// ======================================================
// BUKU TERPOPULER
// ======================================================

function renderBookChart() {

    const counter = {};

    const canvas = document.getElementById("bookChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    loans.forEach(loan => {

        counter[loan.bookTitle] =
            (counter[loan.bookTitle] || 0) + 1;

    });

    const labels =
        Object.keys(counter);

    const values =
        Object.values(counter);

    if (bookChart)
        bookChart.destroy();

    bookChart = new Chart(

        ctx,

        {

            type: "bar",

            data: {

                labels: labels,

                datasets: [

                    {

                        label:
                            "Jumlah Dipinjam",

                        data: values,

                        borderWidth: 1

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        }

    );

}

// =========================================
// PIE STATUS PEMINJAMAN
// =========================================

async function renderStatusChart() {

    const lateResult = await getLateLoans();

    let totalLate = 0;

    if(lateResult.success){

        totalLate = lateResult.data.length;

    }

    const totalBorrowed =
        loans.filter(l => l.status === "BORROWED").length;

    const totalReturned =
        loans.filter(l => l.status === "RETURNED").length;

    const canvas =
        document.getElementById("statusChart");

    if(!canvas){

        console.log("statusChart tidak ditemukan");

        return;

    }

    const ctx = canvas.getContext("2d");

    if(statusChart){

        statusChart.destroy();

    }

    statusChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:[
                "Dipinjam",
                "Dikembalikan",
                "Terlambat"
            ],

datasets: [{

    data: [
        totalBorrowed,
        totalReturned,
        totalLate
    ],

    backgroundColor: [
    "#60a5fa",
    "#4ade80",
    "#f87171"
    ],

    borderColor: "#ffffff",
    borderWidth: 3,
    hoverOffset: 10

}]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

// =========================================
// TOP 5 ANGGOTA PALING AKTIF
// =========================================

function renderMemberChart(){

    const counter = {};

    loans.forEach(loan=>{

        if(!counter[loan.memberName]){

            counter[loan.memberName] = 0;

        }

        counter[loan.memberName]++;

    });

    const sorted = Object.entries(counter)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5);

    const labels = sorted.map(item=>item[0]);

    const values = sorted.map(item=>item[1]);

    const canvas =
        document.getElementById("memberChart");

    if(!canvas){

        console.log("memberChart tidak ditemukan");

        return;

    }

    const ctx = canvas.getContext("2d");

    if(memberChart){

        memberChart.destroy();

    }

    memberChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Jumlah Peminjaman",

                data:values,

                backgroundColor:[
                    "#2563eb",
                    "#3b82f6",
                    "#60a5fa",
                    "#93c5fd",
                    "#bfdbfe"
                ],

                borderRadius:8

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{

                    beginAtZero:true,

                    ticks:{
                        stepSize:1
                    }

                }

            }

        }

    });

}



// ======================================================
// FILTER
// ======================================================

function filterReport() {

    console.log("FILTER BERJALAN");

    const keyword =
        document.getElementById("searchKeyword")
            ? document.getElementById("searchKeyword").value.toLowerCase()
            : "";

    const status =
        document.getElementById("statusFilter")
            ? document.getElementById("statusFilter").value
            : "";

    const startDate =
        document.getElementById("startDate")
            ? document.getElementById("startDate").value
            : "";

    const endDate =
        document.getElementById("endDate")
            ? document.getElementById("endDate").value
            : "";

    let data = [...loans];

    if (keyword !== "") {

        data = data.filter(loan =>

            loan.memberName.toLowerCase().includes(keyword) ||

            loan.bookTitle.toLowerCase().includes(keyword)

        );

    }

    if (status !== "") {

        data = data.filter(

            loan => loan.status === status

        );

    }

if (startDate !== "") {

    data = data.filter(loan =>

        loan.loanDate.substring(0,10) >= startDate

    );

}

if (endDate !== "") {

    data = data.filter(loan =>

        loan.loanDate.substring(0,10) <= endDate

    );

}

    renderTable(data);

}

// ======================================================
// EXPORT EXCEL
// ======================================================

function exportExcel() {

    const data = loans.map(loan => ({

        "ID": loan.id,

        "Nama Anggota": loan.memberName,

        "Judul Buku": loan.bookTitle,

        "Tanggal Pinjam": formatDate(loan.loanDate),

        "Jatuh Tempo": formatDate(loan.dueDate),

        "Tanggal Kembali":
            loan.returnDate
                ? formatDate(loan.returnDate)
                : "-",

        "Status":

            loan.status === "BORROWED"
                ? "Dipinjam"

            : loan.status === "RETURNED"
                ? "Dikembalikan"

            : loan.status === "LATE"
                ? "Terlambat"

            : loan.status,

        "Denda":

            Number(loan.fine || 0)

    }));

    const worksheet =
        XLSX.utils.json_to_sheet(data);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Laporan"

    );

    const today =
        new Date().toLocaleDateString("id-ID")
            .replace(/\//g,"-");

    XLSX.writeFile(

        workbook,

        `Laporan_Transaksi_${today}.xlsx`

    );

}

// ======================================================
// EXPORT PDF (sementara print)
// ======================================================

async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p","mm","a4");

    const today =
        new Date().toLocaleDateString("id-ID");

    doc.setFontSize(18);

    doc.text("LIBMAN",105,15,{align:"center"});

    doc.setFontSize(14);

    doc.text("Laporan Transaksi Perpustakaan",105,23,{align:"center"});

    doc.setFontSize(10);

    doc.text("Jl. Soekarno Hatta No.23 Bandung",105,30,{align:"center"});

    doc.text("Tanggal Cetak : "+today,14,40);

    doc.text("Administrator",160,40);

    doc.autoTable({

        startY:48,

        head:[[
            "ID",
            "Anggota",
            "Buku",
            "Pinjam",
            "Kembali",
            "Status",
            "Denda"
        ]],

        body: loans.map(loan=>[

            loan.id,

            loan.memberName,

            loan.bookTitle,

            formatDate(loan.loanDate),

            loan.returnDate
                ? formatDate(loan.returnDate)
                : "-",

            loan.status,

            "Rp "+Number(loan.fine||0)
                .toLocaleString("id-ID")

        ]),

        styles:{

            fontSize:9,

            cellPadding:2

        },

        headStyles:{

            fillColor:[37,99,235]

        }

    });

    doc.text(

        "Bandung, "+today,

        150,

        doc.lastAutoTable.finalY+20

    );

    doc.text(

        "Administrator",

        160,

        doc.lastAutoTable.finalY+40

    );

    doc.save(

        "Laporan_Transaksi_"+today+".pdf"

    );

}

// ======================================================
// PRINT
// ======================================================

function printReport() {

    const clone =
    document.querySelector(".report-table").cloneNode(true);

    clone.querySelectorAll(".badge").forEach(item=>{

        item.outerHTML=item.innerText;

    });

    const reportTable=
    clone.outerHTML;

    const today =
        new Date().toLocaleDateString("id-ID");

    const totalBook =
        books.length;

    const totalMember =
        members.length;

    const totalLoan =
        loans.length;

    const totalReturn =
        loans.filter(l=>l.status==="RETURNED").length;

    const printWindow =
        window.open("", "", "width=1000,height=800");

    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>Laporan Perpustakaan</title>

<style>

body{

    font-family:Arial,sans-serif;
    padding:35px;
    color:#222;

}

.header{

    text-align:center;
    border-bottom:3px solid black;
    padding-bottom:15px;
    margin-bottom:25px;

}

.header h1{

    margin:0;
    font-size:28px;

}

.header h3{

    margin:5px;
    font-weight:normal;

}

.info{

    display:flex;
    justify-content:space-between;
    margin-bottom:20px;
    font-size:14px;

}

.summary{

    width:100%;
    border-collapse:collapse;
    margin-bottom:25px;

}

.summary td{

    border:1px solid #000;
    padding:8px;

}

.report-table{

    width:100%;
    border-collapse:collapse;

}

.report-table th,
.report-table td{

    border:1px solid black;
    padding:8px;
    text-align:center;
    font-size:13px;

}

.report-table th{

    background:#e5e5e5;

}

.footer{

    margin-top:70px;
    text-align:right;

}

.footer p{

    margin:3px;

}

@media print{

    button{

        display:none;

    }

}

</style>

</head>

<body>

<div class="header">

<h1>LIBMAN</h1>

<h3>Laporan Transaksi Perpustakaan</h3>

<p>Jl. Soekarno Hatta No.23 Bandung</p>

<p>Telp (022) 12345678</p>

</div>

<div class="info">

<div>

Tanggal Cetak :
<b>${today}</b>

</div>

<div>

Dicetak Oleh :
<b>Administrator</b>

</div>

</div>

<table class="summary">

<tr>

<td>Total Buku</td>

<td>${totalBook}</td>

<td>Total Anggota</td>

<td>${totalMember}</td>

</tr>

<tr>

<td>Total Peminjaman</td>

<td>${totalLoan}</td>

<td>Total Pengembalian</td>

<td>${totalReturn}</td>

</tr>

</table>

<h2 style="text-align:center">

DATA TRANSAKSI PERPUSTAKAAN

</h2>

${reportTable}

<div class="footer">

<p>Bandung, ${today}</p>

<br><br><br>

<b>Administrator</b>

</div>

</body>

</html>

`);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

}

// ======================================================
// RESET
// ======================================================

function resetFilter() {

    if(document.getElementById("searchKeyword"))
        document.getElementById("searchKeyword").value="";

    if(document.getElementById("statusFilter"))
        document.getElementById("statusFilter").value="";

    if(document.getElementById("startDate"))
        document.getElementById("startDate").value="";

    if(document.getElementById("endDate"))
        document.getElementById("endDate").value="";

    renderTable();

}

// ======================================================
// EVENT BUTTON
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnSearch =
    document.getElementById("searchBtn");

    if(btnSearch)
    btnSearch.onclick = filterReport;

    const btnExcel =
        document.querySelector(".btn-success");

    if(btnExcel)
        btnExcel.onclick = exportExcel;

    const btnPDF =
        document.querySelector(".btn-danger");

    if(btnPDF)
        btnPDF.onclick = exportPDF;

    const btnPrint =
        document.querySelector(".btn-dark");

    if(btnPrint)
        btnPrint.onclick = printReport;

    const btnReset =
        document.querySelector(".btn-secondary");

    if(btnReset)
        btnReset.onclick = resetFilter;

});