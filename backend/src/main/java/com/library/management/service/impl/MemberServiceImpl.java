package com.library.management.service.impl;

import com.library.management.dto.request.MemberRequest;
import com.library.management.dto.response.MemberResponse;
import com.library.management.entity.Member;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.MemberRepository;
import com.library.management.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // ====================================
    // Mapping Entity -> Response
    // ====================================
    private MemberResponse mapToResponse(Member member) {

        return new MemberResponse(
                member.getId(),
                member.getFullName(),
                member.getNim(),
                member.getStudyProgram(),
                member.getEmail(),
                member.getPhone(),
                member.getAddress(),
                member.getActive(),
                member.getCreatedAt(),
                member.getUpdatedAt()
        );
    }

    // ====================================
    // GET ALL
    // ====================================
@Override
public Page<MemberResponse> getAllMembers(Pageable pageable) {

    System.out.println("TOTAL MEMBER = " + memberRepository.count());

    return memberRepository.findAll(pageable)
            .map(this::mapToResponse);
}

    // ====================================
    // GET BY ID
    // ====================================
    @Override
    public MemberResponse getMemberById(Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member tidak ditemukan"));

        return mapToResponse(member);
    }

    // ====================================
    // CREATE
    // ====================================
    @Override
    public MemberResponse saveMember(MemberRequest request) {

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email sudah digunakan");
        }

        if (memberRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Nomor telepon sudah digunakan");
        }

        Member member = new Member();

        member.setFullName(request.getFullName());
        member.setNim(request.getNim());
        member.setStudyProgram(request.getStudyProgram());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setActive(request.getActive());

        return mapToResponse(memberRepository.save(member));
    }

    // ====================================
    // UPDATE
    // ====================================
    @Override
    public MemberResponse updateMember(Long id, MemberRequest request) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member tidak ditemukan"));

        if (!member.getEmail().equals(request.getEmail())
                && memberRepository.existsByEmail(request.getEmail())) {

            throw new BadRequestException("Email sudah digunakan");
        }

        if (!member.getPhone().equals(request.getPhone())
                && memberRepository.existsByPhone(request.getPhone())) {

            throw new BadRequestException("Nomor telepon sudah digunakan");
        }

        member.setFullName(request.getFullName());
        member.setNim(request.getNim());
        member.setStudyProgram(request.getStudyProgram());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setActive(request.getActive());

        return mapToResponse(memberRepository.save(member));
    }

    // ====================================
    // DELETE
    // ====================================
    @Override
    public void deleteMember(Long id) {

        Member member = memberRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Member tidak ditemukan"));

        memberRepository.delete(member);
    }

    // ====================================
    // SEARCH
    // ====================================
    @Override
    public Page<MemberResponse> searchMember(
            String keyword,
            Pageable pageable) {

        return memberRepository
                .findByFullNameContainingIgnoreCase(keyword, pageable)
                .map(this::mapToResponse);
    }

    
}