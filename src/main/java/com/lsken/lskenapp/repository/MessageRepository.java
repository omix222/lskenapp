package com.lsken.lskenapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsken.lskenapp.domain.Message;


public interface MessageRepository extends JpaRepository<Message, Integer>{
	
	
}
