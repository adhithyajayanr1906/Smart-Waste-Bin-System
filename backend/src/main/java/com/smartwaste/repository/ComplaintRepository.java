package com.smartwaste.repository;

import com.smartwaste.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    List<Complaint> findByBinCode(String binCode);
    List<Complaint> findByStatus(String status);
}