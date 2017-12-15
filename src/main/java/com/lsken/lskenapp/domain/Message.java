package com.lsken.lskenapp.domain;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

	public Message(Integer messageId, String type, String messageDetail, String fromUserId, String groupId,
			Date postDate) {
		super();
		this.messageId = messageId;
		this.type = type;
		this.messageDetail = messageDetail;
		this.fromUserId = fromUserId;
		this.groupId = groupId;
		this.postDate = postDate;
	}
	public Message(){
	}

	@Id
	@GeneratedValue
	@Column(name="messageId")
	private Integer messageId;

	@Column(nullable = false)
	private String type;

	@Column(nullable = false)
	private String messageDetail;

	@Column(nullable = false)
	private String fromUserId;

	@Column(nullable = false)
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

	public String getFromUserId() {
		return fromUserId;
	}

	public void setFromUserId(String fromUserId) {
		this.fromUserId = fromUserId;
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
	
	/**
	 * 投稿日付の自動付与対応。
	 */
	@PrePersist
	  public void prePersist() {
	    Timestamp ts = new Timestamp((new Date()).getTime());
	    this.postDate = ts;
	    }
	
	
}
