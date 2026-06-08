package com.Farm.NASMS.Repository;

import com.Farm.NASMS.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmailAddress(String emailAddress);
}
