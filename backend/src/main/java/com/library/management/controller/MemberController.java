package com.library.management.controller;

import com.library.management.dto.request.MemberRequest;
import com.library.management.dto.response.MemberResponse;
import com.library.management.response.ApiResponse;
import com.library.management.service.MemberService;
import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // ===========================
    // GET ALL
    // ===========================
    @GetMapping
    public ApiResponse<Page<MemberResponse>> getAllMembers(
            @ParameterObject Pageable pageable) {

        return new ApiResponse<>(
                true,
                "Data member berhasil diambil",
                memberService.getAllMembers(pageable)
        );
    }

    // ===========================
    // GET BY ID
    // ===========================
    @GetMapping("/{id}")
    public ApiResponse<MemberResponse> getMemberById(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Data member berhasil ditemukan",
                memberService.getMemberById(id)
        );
    }

    // ===========================
    // CREATE
    // ===========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MemberResponse> createMember(
            @Valid @RequestBody MemberRequest request) {

        return new ApiResponse<>(
                true,
                "Member berhasil ditambahkan",
                memberService.saveMember(request)
        );
    }

    // ===========================
    // UPDATE
    // ===========================
    @PutMapping("/{id}")
    public ApiResponse<MemberResponse> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberRequest request) {

        return new ApiResponse<>(
                true,
                "Member berhasil diupdate",
                memberService.updateMember(id, request)
        );
    }

    // ===========================
    // DELETE
    // ===========================
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMember(@PathVariable Long id) {

        memberService.deleteMember(id);

        return new ApiResponse<>(
                true,
                "Member berhasil dihapus",
                null
        );
    }

    // ===========================
    // SEARCH
    // ===========================
    @GetMapping("/search")
    public ApiResponse<Page<MemberResponse>> searchMember(
            @RequestParam String keyword,
            @ParameterObject Pageable pageable) {

        return new ApiResponse<>(
                true,
                "Pencarian member berhasil",
                memberService.searchMember(keyword, pageable)
        );
    }

}