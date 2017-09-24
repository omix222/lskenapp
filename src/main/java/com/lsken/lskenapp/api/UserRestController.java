package com.lsken.lskenapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.User;
import com.lsken.lskenapp.service.UserService;

@RestController
@RequestMapping("/users")
public class UserRestController {
	@Autowired
	UserService userService;

	@GetMapping
	List<User> getUsers() {
		List<User> users = userService.findAll();
		return users;
	}

	@GetMapping(path = "{id}")
	User getUser(@PathVariable String id) {
		User user = userService.findOne(id);
		return user;
	}
	
	@PostMapping
	User postUser(@RequestBody User newUser) {
		User createdUser = userService.create(newUser);
		return createdUser;
	}
}
