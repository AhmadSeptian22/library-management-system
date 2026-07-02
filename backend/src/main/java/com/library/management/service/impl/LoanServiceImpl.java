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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
                loan.getFine(),
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
    public LoanResponse createLoan(LoanRequest request) {

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member tidak ditemukan"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Buku tidak ditemukan"));

        if (book.getStock() <= 0) {
            throw new BadRequestException("Stok buku habis");
        }

        // Kurangi stok buku
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);

        Loan loan = new Loan();

        loan.setMember(member);
        loan.setBook(book);
        loan.setLoanDate(request.getLoanDate());
        loan.setDueDate(request.getDueDate());
        loan.setStatus(LoanStatus.BORROWED);
        loan.setFine(0.0);

        return mapToResponse(loanRepository.save(loan));
    }


        // ==========================
        // RETURN BOOK
        // ==========================
        @Override
        public LoanResponse returnBook(Long id) {

            Loan loan = loanRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Data peminjaman tidak ditemukan"));

            // Cek apakah buku sudah dikembalikan
            if (loan.getStatus() == LoanStatus.RETURNED) {
                throw new BadRequestException("Buku sudah dikembalikan");
            }

            // Update status
            loan.setStatus(LoanStatus.RETURNED);
            loan.setReturnDate(java.time.LocalDate.now());

            // Tambah stok buku
            Book book = loan.getBook();
            book.setStock(book.getStock() + 1);
            bookRepository.save(book);

            // Simpan loan
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

}