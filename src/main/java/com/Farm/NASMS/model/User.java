package com.Farm.NASMS.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;




@Entity
@Table(name="users", uniqueConstraints={@UniqueConstraint(columnNames = "user_name")})
@SuppressWarnings("unused")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "username cannot be blank")
    @Column(name="user_name")
    private String userName;

    @NotBlank(message="userEmail cannot be blank")
    @Column(name="email_address")
    private String emailAddress;

    @NotBlank(message = "password cannot be blank")
    private String password;
    private String role;

    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }
}
