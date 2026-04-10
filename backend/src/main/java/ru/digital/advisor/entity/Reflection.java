package ru.digital.advisor.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "reflections")
public class Reflection extends BaseEntity {
    private String date;
    private String type; // weekly, monthly
    private String whatWorked;
    private String whatDidnt;
    private String insights;
    private Integer overallScore;

    @ElementCollection
    private List<String> focusAreas;

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getWhatWorked() {
        return whatWorked;
    }

    public void setWhatWorked(String whatWorked) {
        this.whatWorked = whatWorked;
    }

    public String getWhatDidnt() {
        return whatDidnt;
    }

    public void setWhatDidnt(String whatDidnt) {
        this.whatDidnt = whatDidnt;
    }

    public String getInsights() {
        return insights;
    }

    public void setInsights(String insights) {
        this.insights = insights;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public List<String> getFocusAreas() {
        return focusAreas;
    }

    public void setFocusAreas(List<String> focusAreas) {
        this.focusAreas = focusAreas;
    }

    public Reflection() {}
}
