package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "blocking_processes")
public class BlockingProcess extends BaseEntity {
    private String name;
    private String description;
    private String severity; // low, medium, high
    private String status;   // active, in_progress, resolved

    @ElementCollection
    private List<String> unlockExamples;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getUnlockExamples() {
        return unlockExamples;
    }

    public void setUnlockExamples(List<String> unlockExamples) {
        this.unlockExamples = unlockExamples;
    }

    public BlockingProcess() {}
}
