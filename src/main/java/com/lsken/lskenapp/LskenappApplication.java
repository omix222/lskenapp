package com.lsken.lskenapp;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.repository.MessageRepository;

@SpringBootApplication
@RestController
public class LskenappApplication implements CommandLineRunner{
	@Autowired
	MessageRepository messageRepository;
	@Override
	public void run(String... strings) throws Exception {
		Message message = new Message();
		message.setMessageId(2);
		message.setGroupId("g001");
		message.setFromUserId("u001");
		message.setType("text");
		message.setMessageDetail("hello hello");
		message.setPostDate(new Date());
		Message created = messageRepository.save(message);
		System.out.println(created);
		messageRepository.findAll().forEach(System.out::println);
	}

	public static void main(String[] args) {
		SpringApplication.run(LskenappApplication.class, args);
	}
	@GetMapping("/")
	public String home(String[] args) {
		return "hello world!!!";
	}
}
