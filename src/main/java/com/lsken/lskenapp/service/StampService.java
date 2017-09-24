package com.lsken.lskenapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsken.lskenapp.domain.Stamp;
import com.lsken.lskenapp.repository.StampRepository;

@Service
@Transactional
public class StampService {
	@Autowired
	StampRepository stampRepository;

	public List<Stamp> findAll() {
		return stampRepository.findAll();
	}
	
	public Stamp findOne(String stampId) {
		return stampRepository.findOne(stampId);
	}

	public Stamp create(Stamp stamp) {
		return stampRepository.save(stamp);
	}

	public Stamp update(Stamp stamp) {
		return stampRepository.save(stamp);
	}

	public void delete(String stampId) {
		stampRepository.delete(stampId);
	}
}
