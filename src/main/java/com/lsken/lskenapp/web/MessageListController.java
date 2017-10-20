package com.lsken.lskenapp;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.service.MessageService;

import org.springframework.ui.Model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
@Controller
public class MessageListController {
	@Autowired
	MessageService messageService;

	  @RequestMapping("/messagelist")
	    public String index(Model model) {
		  List<Message> messages = messageService.findAllOrderByPostDate();
	 
	        model.addAttribute("msgs", messages);
	        return "messagelistview";
	    }
	}