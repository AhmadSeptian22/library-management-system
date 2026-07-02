package com.library.management.service;

import com.library.management.dto.request.MemberRequest;
import com.library.management.dto.response.MemberResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberService {

    Page<MemberResponse> getAllMembers(Pageable pageable);

    MemberResponse getMemberById(Long id);

    MemberResponse saveMember(MemberRequest request);

    MemberResponse updateMember(Long id, MemberRequest request);

    void deleteMember(Long id);

    Page<MemberResponse> searchMember(
            String keyword,
            Pageable pageable
    );

}