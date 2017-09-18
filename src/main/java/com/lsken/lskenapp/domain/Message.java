package com.lsken.lskenapp.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

	@Id
	@GeneratedValue
	private Integer messageId;

	@Column(nullable = false)
	private String type;

	@Column(nullable = false)
	private String messageDetail;

	@Column(nullable = false)
	private String fromUserId;

	@Column(nullable = false)
	private String groupId;
	
	@Column(nullable = false)
	private Date postDate;

}
