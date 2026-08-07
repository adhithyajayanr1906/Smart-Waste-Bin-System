package com.smartwaste.service;

import com.smartwaste.model.Complaint;
import com.smartwaste.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint saveComplaint(Complaint complaint) {
        complaint.setStatus(complaint.getStatus() == null ? "PENDING" : complaint.getStatus());
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByBinCode(String binCode) {
        return complaintRepository.findByBinCode(binCode);
    }

    public Complaint updateComplaintStatus(String id, String status) {
        return complaintRepository.findById(id).map(complaint -> {
            if ("RESOLVED".equalsIgnoreCase(status)) {
                complaintRepository.delete(complaint);
                complaint.setStatus(status);
                return complaint;
            }
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }).orElse(null);
    }
}
