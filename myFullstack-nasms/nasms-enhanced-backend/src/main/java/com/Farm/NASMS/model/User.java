package com.Farm.NASMS.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "user_name"),
    @UniqueConstraint(columnNames = "email_address")
})
@JsonIgnoreProperties({"hibernateLazyInitializer","handler","password"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @NotBlank(message = "email cannot be blank")
    @Column(name = "email_address", nullable = false)
    private String emailAddress;

    @NotBlank(message = "password cannot be blank")
    private String password;

    private String role;  // ADMIN | FARMER | BUYER | SELLER

    public Long getId()                            { return id; }
    public void setId(Long id)                     { this.id = id; }
    public String getUserName()                    { return userName; }
    public void setUserName(String userName)       { this.userName = userName; }
    public String getEmailAddress()                { return emailAddress; }
    public void setEmailAddress(String e)          { this.emailAddress = e; }
    public String getPassword()                    { return password; }
    public void setPassword(String password)       { this.password = password; }
    public String getRole()                        { return role; }
    public void setRole(String role)               { this.role = role; }
}
