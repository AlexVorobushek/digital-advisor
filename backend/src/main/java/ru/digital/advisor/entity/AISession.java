package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "ai_sessions")
public class AISession extends BaseEntity {
    private String type;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "session_id")
    private List<AIMessage> messages;
    
    @Column(columnDefinition = "TEXT")
    private String context;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<AIMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<AIMessage> messages) {
        this.messages = messages;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public AISession() {}
}
