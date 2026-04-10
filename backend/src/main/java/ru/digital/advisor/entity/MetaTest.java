package ru.digital.advisor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meta_tests")
public class MetaTest extends BaseEntity {
    private String talentName;
    private Integer score;
    private String category;
    private String description;

    public String getTalentName() {
        return talentName;
    }

    public void setTalentName(String talentName) {
        this.talentName = talentName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MetaTest() {}
}
