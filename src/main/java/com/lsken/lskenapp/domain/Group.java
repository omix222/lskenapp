package com.lsken.lskenapp.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "groups")
public class Group {
	
	public Group(String groupId, String groupName) {
		super();
		this.groupId = groupId;
		this.groupName = groupName;
	}
	
	public Group() {
		super();
	}

	@Id
	private String groupId;

	@Column(nullable = false)
	private String groupName;

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

}
