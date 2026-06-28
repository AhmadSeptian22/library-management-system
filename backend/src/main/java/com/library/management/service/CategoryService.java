package com.library.management.service;

import com.library.management.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category saveCategory(Category category);

    Category updateCategory(Long id, Category category);

    void deleteCategory(Long id);

}