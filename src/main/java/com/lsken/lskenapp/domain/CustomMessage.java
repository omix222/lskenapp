package com.lsken.lskenapp.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
public class CustomMessage {

	public CustomMessage(Integer messageId, String type, String messageDetail, String fromUserName, String groupId,
			Date postDate) {
		super();
		this.messageId = messageId;
		this.type = type;
		this.messageDetail = messageDetail;
		this.fromUserName = fromUserName;
		this.groupId = groupId;
		this.postDate = postDate;
	}
	public CustomMessage(){
	}
	@Id
	@Column(name="messageId")
	private Integer messageId;
	@Column
	private String type;
	@Column
	private String messageDetail;
	@Column
	private String fromUserName;
	@Column
	private String groupId;
	@Column
	private Date postDate;
	
	public Integer getMessageId() {
		return messageId;
	}

	public void setMessageId(Integer messageId) {
		this.messageId = messageId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessageDetail() {
		return messageDetail;
	}

	public void setMessageDetail(String messageDetail) {
		this.messageDetail = messageDetail;
	}

	public String getFromUserName() {
		return fromUserName;
	}

	public void setFromUserId(String fromUserName) {
		this.fromUserName = fromUserName;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public Date getPostDate() {
		return postDate;
	}

	public void setPostDate(Date postDate) {
		this.postDate = postDate;
	}
	
}
