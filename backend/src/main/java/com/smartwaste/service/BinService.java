package com.smartwaste.service;

import com.smartwaste.model.Bin;
import com.smartwaste.repository.BinRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BinService {

    private final BinRepository binRepository;

    public BinService(BinRepository binRepository) {
        this.binRepository = binRepository;
    }

    public List<Bin> getAllBins() {
        return binRepository.findAll();
    }

    public Bin addBin(Bin bin) {
        validateBinCode(bin.getBinCode());
        if (binRepository.existsByBinCode(bin.getBinCode())) {
            throw new IllegalArgumentException("Bin code already exists: " + bin.getBinCode());
        }
        return binRepository.save(bin);
    }

    public Optional<Bin> updateFillLevel(String id, String newFillLevel) {
        return binRepository.findById(id).map(bin -> {
            bin.setFillLevel(newFillLevel);
            return binRepository.save(bin);
        });
    }

    public void deleteBin(String id) {
        binRepository.deleteById(id);
    }

    public Optional<Bin> updateBin(String id, Bin updated) {
        return binRepository.findById(id).map(bin -> {
            if (updated.getBinCode() != null && !updated.getBinCode().equals(bin.getBinCode())) {
                validateBinCode(updated.getBinCode());
                if (binRepository.existsByBinCode(updated.getBinCode())) {
                    throw new IllegalArgumentException("Bin code already exists: " + updated.getBinCode());
                }
                bin.setBinCode(updated.getBinCode());
            }
            if (updated.getLocation() != null) bin.setLocation(updated.getLocation());
            if (updated.getFillLevel() != null) bin.setFillLevel(updated.getFillLevel());
            if (updated.getStatus() != null) bin.setStatus(updated.getStatus());
            return binRepository.save(bin);
        });
    }

    private void validateBinCode(String binCode) {
        if (binCode == null || !binCode.matches("^[A-Z]{3}-\\d{3}$")) {
            throw new IllegalArgumentException("Bin code must be in format 'BIN-001' (3 uppercase letters, hyphen, 3 numbers)");
        }
    }
}

    
