package com.Farm.NASMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Farm.NASMS.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmailAddress(String emailAddress);
}
