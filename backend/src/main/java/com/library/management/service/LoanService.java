package com.library.management.service;

import com.library.management.dto.request.LoanRequest;
import com.library.management.dto.response.LoanResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LoanService {

    Page<LoanResponse> getAllLoans(Pageable pageable);

    LoanResponse getLoanById(Long id);

    List<LoanResponse> createLoan(LoanRequest request);

    LoanResponse returnBook(Long id);

    void deleteLoan(Long id);

    Page<LoanResponse> searchLoan(String keyword, Pageable pageable);

    List<LoanResponse> getLateLoans();

}