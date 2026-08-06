package com.smartwaste.controller;

import com.smartwaste.model.Bin;
import com.smartwaste.service.BinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bins")
public class BinController {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    private final BinService binService;

    public BinController(BinService binService) {
        this.binService = binService;
    }

    // GET: http://localhost:8080/api/bins
    @GetMapping
    public List<Bin> getAllBins() {
        return binService.getAllBins();
    }

    // POST: http://localhost:8080/api/bins
    @PostMapping
    public Bin createBin(@RequestBody Bin bin) {
        return binService.addBin(bin);
    }

    // PUT: http://localhost:8080/api/bins/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Bin> updateFillLevel(@PathVariable String id, @RequestBody Map<String, String> body) {
        String fillLevel = body.get("fillLevel");
        return binService.updateFillLevel(id, fillLevel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT: http://localhost:8080/api/bins/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Bin> updateBin(@PathVariable String id, @RequestBody Bin updated) {
        return binService.updateBin(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: http://localhost:8080/api/bins/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBin(@PathVariable String id) {
        binService.deleteBin(id);
        return ResponseEntity.noContent().build();
    }
}
