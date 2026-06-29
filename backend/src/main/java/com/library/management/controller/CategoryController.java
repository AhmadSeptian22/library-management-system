package com.library.management.controller;

import com.library.management.dto.request.CategoryRequest;
import com.library.management.dto.response.CategoryResponse;
import com.library.management.response.ApiResponse;
import com.library.management.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // ===========================
    // GET ALL
    // ===========================
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {

        return new ApiResponse<>(
                true,
                "Data kategori berhasil diambil",
                categoryService.getAllCategories()
        );
    }

    // ===========================
    // GET BY ID
    // ===========================
    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Kategori berhasil ditemukan",
                categoryService.getCategoryById(id)
        );
    }

    // ===========================
    // CREATE
    // ===========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        return new ApiResponse<>(
                true,
                "Kategori berhasil ditambahkan",
                categoryService.saveCategory(request)
        );
    }

    // ===========================
    // UPDATE
    // ===========================
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {

        return new ApiResponse<>(
                true,
                "Kategori berhasil diupdate",
                categoryService.updateCategory(id, request)
        );
    }

    // ===========================
    // DELETE
    // ===========================
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCategory(@PathVariable Long id) {

        categoryService.deleteCategory(id);

        return new ApiResponse<>(
                true,
                "Kategori berhasil dihapus",
                null
        );
    }
}