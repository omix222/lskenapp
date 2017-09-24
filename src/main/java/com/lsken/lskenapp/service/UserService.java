package com.lsken.lskenapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.domain.User;
import com.lsken.lskenapp.repository.MessageRepository;
import com.lsken.lskenapp.repository.UserRepository;

@Service
@Transactional
public class UserService {
	@Autowired
	UserRepository userRepository;

	public List<User> findAll() {
		return userRepository.findAll();
	}
	
	public User findOne(String userId) {
		return userRepository.findOne(userId);
	}

	public User create(User user) {
		return userRepository.save(user);
	}

	public User update(User user) {
		return userRepository.save(user);
	}

	public void delete(String userId) {
		userRepository.delete(userId);
	}
}
