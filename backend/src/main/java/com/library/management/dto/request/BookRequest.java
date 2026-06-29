package com.library.management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookRequest {

    @NotBlank(message = "Judul buku wajib diisi")
    private String title;

    @NotBlank(message = "Penulis wajib diisi")
    private String author;

    private String publisher;

    @NotBlank(message = "ISBN wajib diisi")
    private String isbn;

    @NotNull(message = "Tahun terbit wajib diisi")
    private Integer publicationYear;

    @NotNull(message = "Stok wajib diisi")
    @Min(value = 0, message = "Stok tidak boleh kurang dari 0")
    private Integer stock;

    @NotNull(message = "Kategori wajib dipilih")
    private Long categoryId;

    public BookRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(Integer publicationYear) {
        this.publicationYear = publicationYear;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}