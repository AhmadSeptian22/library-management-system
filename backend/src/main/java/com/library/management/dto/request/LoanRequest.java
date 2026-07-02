package com.library.management.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class LoanRequest {

    @NotNull(message = "Member wajib dipilih")
    private Long memberId;

    @NotNull(message = "Buku wajib dipilih")
    private Long bookId;

    @NotNull(message = "Tanggal pinjam wajib diisi")
    private LocalDate loanDate;

    @NotNull(message = "Tanggal jatuh tempo wajib diisi")
    private LocalDate dueDate;

    public LoanRequest() {
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDate loanDate) {
        this.loanDate = loanDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}