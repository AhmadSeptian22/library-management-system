package com.library.management.repository;

import com.library.management.entity.Loan;
import com.library.management.entity.LoanStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    Page<Loan> findByMember_FullNameContainingIgnoreCase(
            String keyword,
            Pageable pageable
    );

    List<Loan> findByStatusAndDueDateBefore(
            LoanStatus status,
            LocalDate date
    );
    
    long countByMember_IdAndStatus(
        Long memberId,
        LoanStatus status
);     
boolean existsByMemberIdAndBookIdAndStatus(
        Long memberId,
        Long bookId,
        LoanStatus status
);

}