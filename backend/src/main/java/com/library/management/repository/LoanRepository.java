package com.library.management.repository;

import com.library.management.entity.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    Page<Loan> findByMember_FullNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

}