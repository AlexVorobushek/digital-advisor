package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "chronicle_entries")
public class ChronicleEntry extends BaseEntity {
    private String date;
    private String title;
    private String description;
    private String type; // text, photo
    private String linkedRole;

    @ElementCollection
    private List<String> tags;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLinkedRole() {
        return linkedRole;
    }

    public void setLinkedRole(String linkedRole) {
        this.linkedRole = linkedRole;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public ChronicleEntry() {}
}
