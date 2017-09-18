package com.lsken.lskenapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.repository.MessageRepository;

@Service
@Transactional
public class MessageService {
	@Autowired
	MessageRepository messageRepository;

	public List<Message> findAll() {
		return messageRepository.findAll();
	}

	public Message findOne(int mesageId) {
		return messageRepository.findOne(mesageId);
	}

	public Message create(Message mesage) {
		return messageRepository.save(mesage);
	}

	public Message update(Message mesage) {
		return messageRepository.save(mesage);
	}

	public void delete(int mesageId) {
		messageRepository.delete(mesageId);
	}
}
