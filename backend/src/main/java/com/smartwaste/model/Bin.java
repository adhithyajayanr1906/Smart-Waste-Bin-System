package com.smartwaste.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bins")
public class Bin {
    @Id
    private String id;
    
    private String binCode;
    
    private String location;
    private String fillLevel;
    private String status;

    public Bin() {}

    public Bin(String id, String binCode, String location, String fillLevel, String status) {
        this.id = id;
        this.binCode = binCode;
        this.location = location;
        this.fillLevel = fillLevel;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBinCode() { return binCode; }
    public void setBinCode(String binCode) { this.binCode = binCode; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getFillLevel() { return fillLevel; }
    public void setFillLevel(String fillLevel) { this.fillLevel = fillLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
