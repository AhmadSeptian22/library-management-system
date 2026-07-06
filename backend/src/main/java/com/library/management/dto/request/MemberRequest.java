package com.library.management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MemberRequest {

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(max = 100)
    private String fullName;

    @NotBlank(message = "NIM wajib diisi")
    @Size(max = 20)
    private String nim;

    @NotBlank(message = "Program studi wajib diisi")
    @Size(max = 100)
    private String studyProgram;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Nomor telepon wajib diisi")
    @Size(max = 20)
    private String phone;

    @NotBlank(message = "Alamat wajib diisi")
    @Size(max = 255)
    private String address;

    private Boolean active = true;

    public MemberRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getNim() {
        return nim;
    }

    public void setNim(String nim) {
        this.nim = nim;
    }

    public String getStudyProgram() {
        return studyProgram;
    }

    public void setStudyProgram(String studyProgram) {
        this.studyProgram = studyProgram;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}