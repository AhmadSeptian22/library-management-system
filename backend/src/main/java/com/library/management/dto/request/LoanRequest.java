package com.library.management.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class LoanRequest {

    @NotNull(message = "Member wajib dipilih")
    private Long memberId;

    @NotEmpty(message = "Minimal pilih satu buku")
    private List<Long> bookIds;

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

    public List<Long> getBookIds() {
        return bookIds;
    }

    public void setBookIds(List<Long> bookIds) {
        this.bookIds = bookIds;
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