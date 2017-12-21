package com.lsken.lskenapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.Group;
import com.lsken.lskenapp.service.GroupService;

@RestController
@CrossOrigin
@RequestMapping("api/v1.0/groups")
public class GroupRestController {
	@Autowired
	GroupService groupService;

	@GetMapping
	List<Group> getGroups() {
		List<Group> groups = groupService.findAll();
		return groups;
	}

	@GetMapping(path = "{id}")
	Group getGroup(@PathVariable String id) {
		Group group = groupService.findOne(id);
		return group;
	}
	
	@PostMapping
	Group postGroup(@RequestBody Group newGroup) {
		Group createdGroup = groupService.create(newGroup);
		return createdGroup;
	}
}
