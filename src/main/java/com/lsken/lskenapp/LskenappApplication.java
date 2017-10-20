package com.lsken.lskenapp;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.Group;
import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.domain.User;
import com.lsken.lskenapp.repository.GroupRepository;
import com.lsken.lskenapp.repository.MessageRepository;
import com.lsken.lskenapp.repository.StampRepository;
import com.lsken.lskenapp.repository.UserRepository;

@SpringBootApplication
@RestController
public class LskenappApplication implements CommandLineRunner{
	@Autowired
	MessageRepository messageRepository;
	@Autowired
	GroupRepository groupRepository;
	@Autowired
	UserRepository userRepository;
	@Autowired
	StampRepository stampRepository;
	@Override
	public void run(String... strings) throws Exception {
		
		//TODO 初期データ投入。あとで消す。
		
		Message message1 = new Message(2,"text","hello hello","u001","g001",new Date());
		Message message2 = new Message(3,"text","hello hello","u001","g001",new Date());
		Message message3 = new Message(4,"text","hello hello","u001","g001",new Date());
		messageRepository.save(message1);
		messageRepository.save(message2);
		messageRepository.save(message3);
		
		Group group1 = new Group("g001","LS-007");
		groupRepository.save(group1);
		
		User user = new User("u001","takahashi");
		userRepository.save(user);
		
		
		
		
	}

	public static void main(String[] args) {
		SpringApplication.run(LskenappApplication.class, args);
	}
	@GetMapping("/")
	public String home(String[] args) {
		return "hello world!!!";
	}
}
