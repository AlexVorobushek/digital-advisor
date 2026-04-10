package ru.digital.advisor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "victories")
public class Victory extends BaseEntity {
    private String date;
    private String title;
    private String description;
    private Integer score; // 1, 4, 16, 64
    private String linkedRole;
    private String linkedResource;

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

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getLinkedRole() {
        return linkedRole;
    }

    public void setLinkedRole(String linkedRole) {
        this.linkedRole = linkedRole;
    }

    public String getLinkedResource() {
        return linkedResource;
    }

    public void setLinkedResource(String linkedResource) {
        this.linkedResource = linkedResource;
    }

    public Victory() {}
}
