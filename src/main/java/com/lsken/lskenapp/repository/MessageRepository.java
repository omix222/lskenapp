package com.lsken.lskenapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lsken.lskenapp.domain.Message;

public interface MessageRepository extends JpaRepository<Message, Integer>{
	
	@Query(value="SELECT  MESSAGE_ID, FROM_USER_ID, GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m   LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) ORDER BY POST_DATE ASC", nativeQuery=true)  
	public List<Message> findMerge();
	
	@Query(value="SELECT  MESSAGE_ID, FROM_USER_ID, GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m   LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) WHERE m.MESSAGE_ID = :ID ORDER BY POST_DATE ASC", nativeQuery=true)  
	public Message findMergeById(@Param("ID")int id);

}
