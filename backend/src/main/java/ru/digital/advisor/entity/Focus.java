package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "focuses")
public class Focus extends BaseEntity {
    private String title;
    private String type; // weekly, monthly
    private Integer progress;
    private String startDate;
    private String endDate;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "focus_id")
    private List<FocusTask> tasks;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public List<FocusTask> getTasks() {
        return tasks;
    }

    public void setTasks(List<FocusTask> tasks) {
        this.tasks = tasks;
    }

    public Focus() {}
}
