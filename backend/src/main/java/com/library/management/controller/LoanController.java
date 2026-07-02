package com.library.management.controller;

import org.springdoc.core.annotations.ParameterObject;
import com.library.management.dto.request.LoanRequest;
import com.library.management.dto.response.LoanResponse;
import com.library.management.response.ApiResponse;
import com.library.management.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    // ==========================
    // GET ALL
    // ==========================
    
        @GetMapping
        public ApiResponse<Page<LoanResponse>> getAllLoans(
        @ParameterObject Pageable pageable) {

         return new ApiResponse<>(
            true,
            "Data peminjaman berhasil diambil",
            loanService.getAllLoans(pageable)
    );

    }

    // ==========================
    // GET BY ID
    // ==========================
    @GetMapping("/{id}")
    public ApiResponse<LoanResponse> getLoanById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Data peminjaman berhasil ditemukan",
                loanService.getLoanById(id)
        );
    }

    // ==========================
    // CREATE
    // ==========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LoanResponse> createLoan(
            @Valid @RequestBody LoanRequest request) {

        return new ApiResponse<>(
                true,
                "Peminjaman berhasil dibuat",
                loanService.createLoan(request)
        );
    }

    // ==========================
    // RETURN BOOK
    // ==========================
    @PutMapping("/{id}/return")
    public ApiResponse<LoanResponse> returnBook(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Buku berhasil dikembalikan",
                loanService.returnBook(id)
        );
    }

    // ==========================
    // DELETE
    // ==========================
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteLoan(@PathVariable Long id) {

        loanService.deleteLoan(id);

        return new ApiResponse<>(
                true,
                "Data peminjaman berhasil dihapus",
                null
        );
    }

    // ==========================
    // SEARCH
    // ==========================
    @GetMapping("/search")
public ApiResponse<Page<LoanResponse>> searchLoan(
        @RequestParam String keyword,
        @ParameterObject Pageable pageable) {

        return new ApiResponse<>(
                true,
                "Pencarian berhasil",
                loanService.searchLoan(keyword, pageable)
        );
    }

}