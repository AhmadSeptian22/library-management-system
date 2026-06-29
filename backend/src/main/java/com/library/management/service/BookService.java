package com.library.management.service;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface BookService {

    Page<BookResponse> getAllBooks(Pageable pageable);

    BookResponse getBookById(Long id);

    BookResponse saveBook(BookRequest request);

    BookResponse updateBook(Long id, BookRequest request);

    void deleteBook(Long id);

    

    Page<BookResponse> searchBook(
        String keyword,
        Pageable pageable
);

}