package ru.digital.advisor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_messages")
public class AIMessage extends BaseEntity {
    private String role; // bot | user
    @Column(columnDefinition = "TEXT")
    private String text;
    private String timestamp;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public AIMessage() {}

    public AIMessage(String role, String text, String timestamp) {
        this.role = role;
        this.text = text;
        this.timestamp = timestamp;
    }
}
