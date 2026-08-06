package com.smartwaste.config;

import com.smartwaste.model.Admin;
import com.smartwaste.model.Bin;
import com.smartwaste.repository.AdminRepository;
import com.smartwaste.repository.BinRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BinRepository binRepository;
    private final AdminRepository adminRepository;

    public DataInitializer(BinRepository binRepository, AdminRepository adminRepository) {
        this.binRepository = binRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        // Seed default Admin if none exists
        if (adminRepository.count() == 0) {
            Admin admin = new Admin(null, "admin", "admin123", "ROLE_ADMIN");
            adminRepository.save(admin);
            System.out.println("Default admin created: username='admin', password='admin123'");
        }

        // Seed default Bins if none exist
        if (binRepository.count() == 0) {
            binRepository.save(new Bin(null, "BIN001", "Main Cafeteria - Exit A", "Overflowing", "ACTIVE"));
            binRepository.save(new Bin(null, "BIN002", "Library - Floor 2", "Half Full", "ACTIVE"));
            binRepository.save(new Bin(null, "BIN003", "Sports Complex - Gate 1", "Empty", "ACTIVE"));
            System.out.println("Sample Bins seeded into MongoDB successfully.");
        }
    }
}
