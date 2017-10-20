package com.lsken.lskenapp.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stamps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stamp {
	
	public Stamp(String fileName, String data) {
		super();
		this.fileName = fileName;
		this.data = data;
	}
	
	public Stamp(){
		super();
	}
	
	@Id
	private String fileName;

	@Column(nullable = false)
	private String data;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

}
