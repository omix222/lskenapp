package com.lsken.lskenapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lsken.lskenapp.domain.CustomMessage;
public interface CustomMessageRepository extends JpaRepository<CustomMessage, Integer>{
	
	@Query(value="SELECT  MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , USERS u where m.FROM_USER_ID = u.USER_ID ORDER BY POST_DATE ASC", nativeQuery=true)  
	public List<CustomMessage> findMerge();
	
	@Query(value="SELECT  MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , USERS u where m.FROM_USER_ID = u.USER_ID AND m.MESSAGE_ID = :ID ORDER BY POST_DATE ASC", nativeQuery=true)  
	public CustomMessage findMergeById(@Param("ID")int id);
	
}
