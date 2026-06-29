package com.library.management.controller;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookResponse;
import com.library.management.response.ApiResponse;
import com.library.management.service.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // ===========================
    // GET ALL BOOK
    // ===========================
    @GetMapping
    public ApiResponse<Page<BookResponse>> getAllBooks(Pageable pageable) {

        return new ApiResponse<>(
                true,
                "Data buku berhasil diambil",
                bookService.getAllBooks(pageable)
        );
    }

    // ===========================
    // GET BOOK BY ID
    // ===========================
    @GetMapping("/{id}")
    public ApiResponse<BookResponse> getBookById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Data buku berhasil ditemukan",
                bookService.getBookById(id)
        );
    }

    // ===========================
    // CREATE BOOK
    // ===========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<BookResponse> createBook(
            @Valid @RequestBody BookRequest request) {

        return new ApiResponse<>(
                true,
                "Buku berhasil ditambahkan",
                bookService.saveBook(request)
        );
    }

    // ===========================
    // UPDATE BOOK
    // ===========================
    @PutMapping("/{id}")
    public ApiResponse<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookRequest request) {

        return new ApiResponse<>(
                true,
                "Buku berhasil diupdate",
                bookService.updateBook(id, request)
        );
    }

    // ===========================
    // DELETE BOOK
    // ===========================
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteBook(@PathVariable Long id) {

        bookService.deleteBook(id);

        return new ApiResponse<>(
                true,
                "Buku berhasil dihapus",
                null
        );
    }

    // ===========================
    // SEARCH BOOK
    // ===========================
@GetMapping("/search")
public ApiResponse<Page<BookResponse>> searchBook(
        @RequestParam String keyword,
        Pageable pageable) {

    return new ApiResponse<>(
            true,
            "Pencarian buku berhasil",
            bookService.searchBook(keyword, pageable)
    );
}

}