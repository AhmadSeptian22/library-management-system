package com.library.management.service.impl;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookResponse;
import com.library.management.entity.Book;
import com.library.management.entity.Category;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.CategoryRepository;
import com.library.management.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookServiceImpl(BookRepository bookRepository,
                           CategoryRepository categoryRepository) {

        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    // =============================
    // Mapping Entity -> Response
    // =============================
    private BookResponse mapToResponse(Book book) {

        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getIsbn(),
                book.getPublicationYear(),
                book.getStock(),
                book.getCategory().getId(),
                book.getCategory().getName(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }

    @Override
    public Page<BookResponse> getAllBooks(Pageable pageable) {

        return bookRepository.findAll(pageable)
                .map(this::mapToResponse);

    }

    @Override
    public BookResponse getBookById(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buku tidak ditemukan"));

        return mapToResponse(book);
    }

    @Override
    public BookResponse saveBook(BookRequest request) {

        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new RuntimeException("ISBN sudah digunakan");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Kategori tidak ditemukan"));

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPublisher(request.getPublisher());
        book.setIsbn(request.getIsbn());
        book.setPublicationYear(request.getPublicationYear());
        book.setStock(request.getStock());
        book.setCategory(category);

        return mapToResponse(bookRepository.save(book));
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buku tidak ditemukan"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Kategori tidak ditemukan"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setPublisher(request.getPublisher());
        book.setIsbn(request.getIsbn());
        book.setPublicationYear(request.getPublicationYear());
        book.setStock(request.getStock());
        book.setCategory(category);

        return mapToResponse(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buku tidak ditemukan"));

        bookRepository.delete(book);
    }

    @Override
    public Page<BookResponse> searchBook(
            String keyword,
            Pageable pageable) {

        return bookRepository
                .findByTitleContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);

    }
       
}