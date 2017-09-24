package com.lsken.lskenapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.Stamp;
import com.lsken.lskenapp.service.StampService;

@RestController
@RequestMapping("/stamps")
public class StampRestController {
	@Autowired
	StampService stampService;

	@GetMapping
	List<Stamp> getStamps() {
		List<Stamp> stamps = stampService.findAll();
		return stamps;
	}

	@GetMapping(path = "{id}")
	Stamp getStamps(@PathVariable String id) {
		Stamp stamp = stampService.findOne(id);
		return stamp;
	}
	
	@PostMapping
	Stamp postStamp(@RequestBody Stamp newStamp) {
		Stamp createdStamp = stampService.create(newStamp);
		return createdStamp;
	}
}
