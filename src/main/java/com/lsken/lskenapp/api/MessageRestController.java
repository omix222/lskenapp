package com.lsken.lskenapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.service.MessageService;

@RestController
@RequestMapping("/messages")
public class MessageRestController {
	@Autowired
	MessageService messageService;

	@GetMapping
	List<Message> getMessages() {
		List<Message> messages = messageService.findAll();
		return messages;
	}

	@GetMapping(path = "{id}")
	Message getMessages(@PathVariable Integer id) {
		Message message = messageService.findOne(id);
		return message;
	}
}
