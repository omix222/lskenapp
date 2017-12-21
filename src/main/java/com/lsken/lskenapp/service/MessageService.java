package com.lsken.lskenapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsken.lskenapp.domain.CustomMessage;
import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.repository.CustomMessageRepository;
import com.lsken.lskenapp.repository.MessageRepository;

@Service
@Transactional
public class MessageService {
	@Autowired
	MessageRepository messageRepository;
	
	@Autowired
	CustomMessageRepository customuMessageRepository;

	public List<Message> findAll() {
		return messageRepository.findAll();
	}
	
	public List<Message> findAllOrderByPostDate() {
		return messageRepository.findAll(new Sort(Direction.DESC,"postDate"));
	}
	public List<CustomMessage> findAllAndMergeOrderByPostDate() {
		return customuMessageRepository.findMerge();
	}
	public Message findOne(int mesageId) {
		return messageRepository.findOne(mesageId);
	}
	public CustomMessage findOneMerge(int mesageId) {
		return customuMessageRepository.findMergeById(mesageId);
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
