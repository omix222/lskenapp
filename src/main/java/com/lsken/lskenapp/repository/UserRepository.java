package com.lsken.lskenapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsken.lskenapp.domain.User;

public interface UserRepository extends JpaRepository<User, String>{

}
