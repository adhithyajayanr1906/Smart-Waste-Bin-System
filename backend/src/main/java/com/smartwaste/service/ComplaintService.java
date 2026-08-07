package com.smartwaste.service;

import com.smartwaste.model.Bin;
import com.smartwaste.model.Complaint;
import com.smartwaste.repository.BinRepository;
import com.smartwaste.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final BinRepository binRepository;

    public ComplaintService(ComplaintRepository complaintRepository, BinRepository binRepository) {
        this.complaintRepository = complaintRepository;
        this.binRepository = binRepository;
    }

    public Complaint saveComplaint(Complaint complaint) {
        Optional<Bin> binOpt = binRepository.findByBinCode(complaint.getBinCode());
        if (binOpt.isEmpty() || !"ACTIVE".equalsIgnoreCase(binOpt.get().getStatus())) {
            throw new IllegalArgumentException("no bins found");
        }
        
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
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }).orElse(null);
    }

    public void deleteComplaint(String id) {
        complaintRepository.deleteById(id);
    }
}
