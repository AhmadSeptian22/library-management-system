package com.library.management.service.impl;

import com.library.management.entity.LoanStatus;
import com.library.management.dto.request.LoanRequest;
import com.library.management.dto.response.LoanResponse;
import com.library.management.entity.Book;
import com.library.management.entity.Loan;
import com.library.management.entity.Member;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.LoanRepository;
import com.library.management.repository.MemberRepository;
import com.library.management.service.LoanService;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;

    public LoanServiceImpl(
            LoanRepository loanRepository,
            MemberRepository memberRepository,
            BookRepository bookRepository) {

        this.loanRepository = loanRepository;
        this.memberRepository = memberRepository;
        this.bookRepository = bookRepository;
    }

    // ==========================
    // MAPPING
    // ==========================
private LoanResponse mapToResponse(Loan loan) {

    double fine = loan.getFine();

    if (loan.getStatus() == LoanStatus.BORROWED) {

        LocalDate today = LocalDate.now();

        if (today.isAfter(loan.getDueDate())) {

            long lateDays =
                    ChronoUnit.DAYS.between(
                            loan.getDueDate(),
                            today);

            fine = lateDays * 2000;

        }

    }

    return new LoanResponse(
            loan.getId(),
            loan.getMember().getId(),
            loan.getMember().getFullName(),
            loan.getBook().getId(),
            loan.getBook().getTitle(),
            loan.getLoanDate(),
            loan.getDueDate(),
            loan.getReturnDate(),
            loan.getStatus(),
            fine,
            loan.getCreatedAt(),
            loan.getUpdatedAt()
    );
}

    // ==========================
    // GET ALL
    // ==========================
    @Override
    public Page<LoanResponse> getAllLoans(Pageable pageable) {

        return loanRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    // ==========================
    // GET BY ID
    // ==========================
    @Override
    public LoanResponse getLoanById(Long id) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Data peminjaman tidak ditemukan"));

        return mapToResponse(loan);
    }

    // ==========================
    // CREATE LOAN
    // ==========================
    @Override
public List<LoanResponse> createLoan(LoanRequest request) {

    Member member = memberRepository.findById(request.getMemberId())
            .orElseThrow(() ->
                    new ResourceNotFoundException("Member tidak ditemukan"));

    if (!Boolean.TRUE.equals(member.getActive())) {
            throw new BadRequestException(
            "Member tidak aktif, tidak dapat melakukan peminjaman."
        );
    }

    long totalBorrowed =
            loanRepository.countByMember_IdAndStatus(
                    member.getId(),
                    LoanStatus.BORROWED
        );

if (totalBorrowed + request.getBookIds().size() > 3) {

    throw new BadRequestException(
            "Member hanya boleh meminjam maksimal 3 buku."
    );

}

    List<LoanResponse> responses = new java.util.ArrayList<>();

    for (Long bookId : request.getBookIds()) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buku tidak ditemukan"));

    if (loanRepository.existsByMemberIdAndBookIdAndStatus(
        member.getId(),
        book.getId(),
        LoanStatus.BORROWED)) {

    throw new BadRequestException(
            "Member masih meminjam buku \"" + book.getTitle() + "\""
    );
}

        if (book.getStock() <= 0) {
            throw new BadRequestException(
                    "Stok buku \"" + book.getTitle() + "\" habis");
        }

        // kurangi stok
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);

        Loan loan = new Loan();

        loan.setMember(member);
        loan.setBook(book);
        loan.setLoanDate(request.getLoanDate());
        loan.setDueDate(request.getDueDate());
        loan.setStatus(LoanStatus.BORROWED);
        loan.setFine(0.0);

        Loan savedLoan = loanRepository.save(loan);

        responses.add(mapToResponse(savedLoan));
    }

    return responses;
}


        // ==========================
        // RETURN BOOK
        // ==========================
    @Override
    public LoanResponse returnBook(Long id) {

    Loan loan = loanRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Data peminjaman tidak ditemukan"));

    // Buku sudah dikembalikan
    if (loan.getStatus() == LoanStatus.RETURNED) {
        throw new BadRequestException("Buku sudah dikembalikan");
    }
    
        // ==========================
        // HITUNG DENDA
        // ==========================

    LocalDate today = java.time.LocalDate.now();

    long lateDays = ChronoUnit.DAYS.between(
            loan.getDueDate(),
            today
    );

    double fine = 0;

    if (lateDays > 0) {
        fine = lateDays * 2000; // Rp2.000 per hari
    }

    loan.setFine(fine);

    // ==========================
    // UPDATE STATUS
    // ==========================

    loan.setStatus(LoanStatus.RETURNED);
    loan.setReturnDate(today);

    // ==========================
    // TAMBAH STOK BUKU
    // ==========================

    Book book = loan.getBook();

    book.setStock(book.getStock() + 1);

    bookRepository.save(book);

    loanRepository.save(loan);

    return mapToResponse(loan);
}
    // ==========================
    // DELETE
    // ==========================
    @Override
    public void deleteLoan(Long id) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Data peminjaman tidak ditemukan"));

        loanRepository.delete(loan);
    }

    // ==========================
    // SEARCH
    // ==========================
    @Override
    public Page<LoanResponse> searchLoan(String keyword, Pageable pageable) {

        return loanRepository
                .findByMember_FullNameContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }

@Override
public List<LoanResponse> getLateLoans(){

    return loanRepository
            .findByStatusAndDueDateBefore(
                    LoanStatus.BORROWED,
                    LocalDate.now()
            )
            .stream()
            .map(this::mapToResponse)
            .toList();

}
}