package com.lsken.lskenapp.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "stamps")
public class Stamp {
	
	public Stamp(String fileName, String data) {
		super();
		this.filename = fileName;
		this.data = data;
	}
	
	public Stamp(){
		super();
	}
	
	@Id
	@Column(name="filename")
	private String filename;

	@Column(length = 20000)
	private String data;

	public String getFilename() {
		return filename;
	}

	public void setFilename(String fileName) {
		this.filename = fileName;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

}
