package com.lsken.lskenapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lsken.lskenapp.domain.CustomMessage;
public interface CustomMessageRepository extends JpaRepository<CustomMessage, Integer>{
	
	@Query(value="SELECT  MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'map' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , USERS u where m.FROM_USER_ID = u.USER_ID ORDER BY POST_DATE ASC", nativeQuery=true)  
	public List<CustomMessage> findMerge();
	
	@Query(value="SELECT  MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'map' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,TYPE, POST_DATE FROM MESSAGES m LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , USERS u where m.FROM_USER_ID = u.USER_ID AND m.MESSAGE_ID = :ID ORDER BY POST_DATE ASC", nativeQuery=true)  
	public CustomMessage findMergeById(@Param("ID")int id);
	
	/**
	 * 指定IDより基準のメッセージを取得(指定件数)
	 * @param offset
	 * @param limit
	 * @return
	 */
	@Query(value="select * from ( "
			+ "SELECT "
			+ "MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, "
			+ "CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'map' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,"
			+ "TYPE, POST_DATE "
			+ "FROM MESSAGES m "
			+ "LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , "
			+ "USERS u "
			+ "where m.FROM_USER_ID = u.USER_ID and ((?1 >= 0 and m.MESSAGE_ID > ABS(?1)) or (?1 < 0 and m.MESSAGE_ID < ABS(?1)))"
			+ "ORDER BY POST_DATE ASC "
			+ ") t "
			+ "where rownum <= (?2) "
			+ "order by "
			+ "case ?3 when 0 then t.message_id end,"
			+ "case ?3 when 1 then t.message_id end desc", 
			nativeQuery=true)
	List<CustomMessage> findLatestLimit(Integer offset, Integer limit, Integer sort);
	
	/**
	 * 指定IDより基準のメッセージを取得(指定件数)
	 * @param offset
	 * @param limit
	 * @return
	 */
	@Query(value="select * from ( "
			+ "SELECT "
			+ "MESSAGE_ID, u.USER_NAME FROM_USER_NAME , GROUP_ID, "
			+ "CASE TYPE WHEN 'text' THEN MESSAGE_DETAIL WHEN 'map' THEN MESSAGE_DETAIL WHEN 'stamp' THEN DATA END AS MESSAGE_DETAIL,"
			+ "TYPE, POST_DATE "
			+ "FROM MESSAGES m "
			+ "LEFT OUTER JOIN STAMPS s ON  (s.FILENAME = m.MESSAGE_DETAIL) , "
			+ "USERS u "
			+ "where m.FROM_USER_ID = u.USER_ID "
			+ "ORDER BY POST_DATE DESC "
			+ ") t "
			+ "where rownum <= (?1) "
			+ "order by "
			+ "case ?2 when 0 then t.message_id end,"
			+ "case ?2 when 1 then t.message_id end desc", 
			nativeQuery=true)
	List<CustomMessage> findLatestLimit(Integer limit, Integer sort);
}
