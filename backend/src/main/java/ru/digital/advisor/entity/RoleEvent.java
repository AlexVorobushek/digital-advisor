package ru.digital.advisor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoleEvent extends BaseEntity {
    private String date;
    private String description;
    private Integer score;
}
