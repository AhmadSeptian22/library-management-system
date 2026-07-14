package com.library.management.dto.response;

public class DashboardResponse {

    private Long totalBooks;
    private Long totalCategories;
    private Long totalMembers;
    private Long totalBorrowings;

    public DashboardResponse() {
    }

    public DashboardResponse(Long totalBooks,
                             Long totalCategories,
                             Long totalMembers,
                             Long totalBorrowings) {

        this.totalBooks = totalBooks;
        this.totalCategories = totalCategories;
        this.totalMembers = totalMembers;
        this.totalBorrowings = totalBorrowings;

    }

    public Long getTotalBooks() {
        return totalBooks;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public Long getTotalMembers() {
        return totalMembers;
    }

    public Long getTotalBorrowings() {
        return totalBorrowings;
    }

}