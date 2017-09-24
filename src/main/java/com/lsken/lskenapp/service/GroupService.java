package com.lsken.lskenapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsken.lskenapp.domain.Group;
import com.lsken.lskenapp.repository.GroupRepository;

@Service
@Transactional
public class GroupService {
	@Autowired
	GroupRepository groupRepository;

	public List<Group> findAll() {
		return groupRepository.findAll();
	}
	
	public Group findOne(String groupId) {
		return groupRepository.findOne(groupId);
	}

	public Group create(Group group) {
		return groupRepository.save(group);
	}

	public Group update(Group group) {
		return groupRepository.save(group);
	}

	public void delete(String groupId) {
		groupRepository.delete(groupId);
	}
}
