document.addEventListener("DOMContentLoaded", () => {

    if (!isLogin()) {
        window.location.href = "login.html";
        return;
    }

    loadReturns();
    

    document
        .getElementById("searchLoan")
        .addEventListener("keyup", searchLoan);

});

let loans = [];


// ======================================
// LOAD DATA
// ======================================

async function loadReturns() {

    const result = await getLoans();

    if (!result.success) {

        alert(result.message);

        return;

    }

    loans = result.data.content;
    console.log(loans);
    renderTable(loans);
    renderHistory(loans);
    updateSummary();

}


// ======================================
// TABLE
// ======================================

function renderTable(data) {

    const tbody =
        document.getElementById("returnTableBody");

    tbody.innerHTML = "";

    data
        .filter(loan => loan.status === "BORROWED")
        .forEach(loan => {

            tbody.innerHTML += `

            <tr>

                <td>${loan.memberName}</td>

                <td>${loan.bookTitle}</td>

                <td>${loan.loanDate}</td>

                <td>${loan.dueDate}</td>

                <td>

                    <span class="status active">

                        Dipinjam

                    </span>

                </td>

                <td>

                    ${formatCurrency(loan.fine)}

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="returnBook(${loan.id})">

                        <i class="fa-solid fa-rotate-left"></i>

                    </button>

                </td>

            </tr>

            `;

        });

}
// ======================================
// HISTORY TABLE
// ======================================

// ======================================
// RIWAYAT PENGEMBALIAN
// ======================================

function renderHistory(data){

    const tbody =
        document.getElementById("historyTableBody");

    tbody.innerHTML = "";

    data
        .filter(loan => loan.status === "RETURNED")
        .forEach(loan => {

            tbody.innerHTML += `

            <tr>

                <td>${loan.memberName}</td>

                <td>${loan.bookTitle}</td>

                <td>${formatDate(loan.loanDate)}</td>

                <td>${formatDate(loan.dueDate)}</td>

                <td>${formatDate(loan.returnDate)}</td>

                <td>${formatCurrency(loan.fine)}</td>

                <td>
                    <span class="status returned">
                        Sudah Kembali
                    </span>
                </td>

            </tr>

            `;

        });

}

// ======================================
// SUMMARY
// ======================================

function updateSummary() {

    const borrowed =
        loans.filter(l => l.status === "BORROWED").length;

    const returned =
        loans.filter(l => l.status === "RETURNED").length;

    const totalFine =
        loans.reduce((sum, loan) => sum + loan.fine, 0);

    document.getElementById("borrowCount").innerHTML =
        borrowed;

    document.getElementById("returnedCount").innerHTML =
        returned;

    document.getElementById("fineTotal").innerHTML =
        "Rp " + totalFine.toLocaleString("id-ID");

}



// ======================================
// SEARCH
// ======================================

function searchLoan() {

    const keyword =
        document
        .getElementById("searchLoan")
        .value
        .toLowerCase();

    const filtered = loans.filter(loan =>

        loan.memberName.toLowerCase().includes(keyword)

        ||

        loan.bookTitle.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

}



// ======================================
// RETURN BOOK
// ======================================

async function returnBook(id) {

    if (!confirm("Yakin buku akan dikembalikan?"))
        return;

    const result =
        await returnLoan(id);

    if (result.success) {

        alert("Buku berhasil dikembalikan.");

        loadReturns();

    } else {

        alert(result.message);

    }

}