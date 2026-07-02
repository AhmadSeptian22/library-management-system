package com.library.management.dto.response;

import com.library.management.entity.LoanStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LoanResponse {

    private Long id;

    private Long memberId;
    private String memberName;

    private Long bookId;
    private String bookTitle;

    private LocalDate loanDate;
    private LocalDate dueDate;
    private LocalDate returnDate;

    private LoanStatus status;

    private Double fine;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LoanResponse() {
    }

    public LoanResponse(
            Long id,
            Long memberId,
            String memberName,
            Long bookId,
            String bookTitle,
            LocalDate loanDate,
            LocalDate dueDate,
            LocalDate returnDate,
            LoanStatus status,
            Double fine,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.memberId = memberId;
        this.memberName = memberName;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.fine = fine;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public Long getBookId() {
        return bookId;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public LocalDate getLoanDate() {
        return loanDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public Double getFine() {
        return fine;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}