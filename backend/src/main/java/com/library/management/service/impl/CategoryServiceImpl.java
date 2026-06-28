package com.library.management.service.impl;

import com.library.management.entity.Category;
import com.library.management.repository.CategoryRepository;
import com.library.management.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // Constructor Injection
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategori tidak ditemukan"));
    }

    @Override
    public Category saveCategory(Category category) {

        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Nama kategori sudah ada");
        }

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {

        Category existing = getCategoryById(id);

        existing.setName(category.getName());
        existing.setDescription(category.getDescription());

        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = getCategoryById(id);

        categoryRepository.delete(category);
    }
}