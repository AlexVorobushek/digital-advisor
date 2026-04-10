package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "business_models")
public class BusinessModel extends BaseEntity {
    private String block;
    private String description;
    private Integer progress;

    @ElementCollection
    private List<String> roles;

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public BusinessModel() {}
}
