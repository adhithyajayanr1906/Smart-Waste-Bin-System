package com.smartwaste.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;
    private String binCode;
    private String issueType;
    private String description;
    private String reporterEmail;
    private String status;
    private LocalDateTime createdAt;

    public Complaint() {
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Complaint(String id, String binCode, String issueType, String description, String reporterEmail, String status, LocalDateTime createdAt) {
        this.id = id;
        this.binCode = binCode;
        this.issueType = issueType;
        this.description = description;
        this.reporterEmail = reporterEmail;
        this.status = status == null ? "PENDING" : status;
        this.createdAt = createdAt == null ? LocalDateTime.now() : createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBinCode() {
        return binCode;
    }

    public void setBinCode(String binCode) {
        this.binCode = binCode;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReporterEmail() {
        return reporterEmail;
    }

    public void setReporterEmail(String reporterEmail) {
        this.reporterEmail = reporterEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
