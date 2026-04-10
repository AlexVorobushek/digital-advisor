package ru.digital.advisor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "focus_tasks")
public class FocusTask extends BaseEntity {
    private String title;
    private boolean completed;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public FocusTask() {}
}
