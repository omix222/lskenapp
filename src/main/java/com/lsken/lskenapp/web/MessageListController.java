package com.lsken.lskenapp.web;
import org.springframework.web.bind.annotation.RequestMapping;

import com.lsken.lskenapp.domain.CustomMessage;
import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.service.MessageService;

import org.springframework.ui.Model;

import java.util.List;

import org.springframework.beans.BeanUtils;
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
		  @RequestMapping("/messagelistmerge")
		    public String indexMerge(Model model) {
			  List<CustomMessage> messages = messageService.findAllAndMergeOrderByPostDate();
		        model.addAttribute("msgs", messages);
		        return "messagelistviewstampmerge";
		    }
		  
		  @RequestMapping("/messagelistlikealine")
		    public String likealine(Model model) {
			  List<CustomMessage> messages = messageService.findAllAndMergeOrderByPostDate();
		        model.addAttribute("msgs", messages);
		        model.addAttribute("mesageForm", new Message());
		        return "likealine";
		    }
		  @RequestMapping("/messegepost")
		    public String likealinePost(Message form,Model model) {
			  Message mesage = new Message();
			  BeanUtils.copyProperties(form, mesage);
			  messageService.create(mesage);
		      return "redirect:/messagelistlikealine";
		    }
	}