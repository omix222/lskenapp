package com.lsken.lskenapp.web;

import org.springframework.web.bind.annotation.RequestMapping;

import com.lsken.lskenapp.domain.Stamp;
import com.lsken.lskenapp.service.StampService;

import org.springframework.ui.Model;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class StampListController {

	@Autowired
	StampService stampService;

	@RequestMapping("/stamplist")
	public String index(Model model) {
		List<Stamp> stamps = stampService.findAll();
		model.addAttribute("stamps", stamps);
		return "stamplistview";
	}
}
