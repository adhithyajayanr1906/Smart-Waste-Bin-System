package com.smartwaste.repository;

import com.smartwaste.model.Bin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BinRepository extends MongoRepository<Bin, String> {
    Optional<Bin> findByBinCode(String binCode);
    boolean existsByBinCode(String binCode);
}