package com.lsken.lskenapp.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lsken.lskenapp.domain.CustomMessage;
import com.lsken.lskenapp.domain.Message;
import com.lsken.lskenapp.service.MessageService;

/**
 * メッセージAPIの改良版。 既存のものはメッセージ取得時にスタンプがあった場合はmessageDetailにStampIDが返ってきていたが、
 * 画像データそのものを返すようにしたもの。パフォーマンス向上を狙いとしたもの。
 */
@CrossOrigin
@RestController
@RequestMapping("api/v1.1/messages")
public class CustomMessageRestController {
	@Autowired
	MessageService messageService;

	@GetMapping
	List<CustomMessage> getMessages(@RequestHeader(name = "Authorization") String token) {
		List<CustomMessage> messages = messageService.findAllAndMergeOrderByPostDate();
		return messages;
	}

	@GetMapping(path = "{id}")
	CustomMessage getMessage(@PathVariable Integer id,@RequestHeader(name = "Authorization") String token) {
		CustomMessage message = messageService.findOneMerge(id);
		return message;
	}

	/**
	 * 受け取ったメッセージをDBへ登録。正しく登録できたらその内容をDBから取得し、返却する
	 * 引数はMessageクラスとなっているが、メッセージIDはこれを使わず、アプリケーション側で自動採番する。
	 * 
	 * @param newMessage
	 * @return
	 */

	// offset、limit対応
	@GetMapping("/search")
	List<CustomMessage> getMessages(
			@RequestHeader(name = "Authorization") String token,
			@RequestParam(name = "offset", defaultValue = "") String offset,  
			@RequestParam(name = "limit", defaultValue = "100") Integer limit,
			@RequestParam(name = "sort", defaultValue = "+") String sort) {
		// offset、limit を指定して
		List<CustomMessage> messages = messageService.findItems(offset, limit, sort);
		return messages;
	}

	/**
	 * 受け取ったメッセージをDBへ登録。正しく登録できたらその内容をDBから取得し、返却する
	 * 引数はMessageクラスとなっているが、メッセージIDはこれを使わず、アプリケーション側で自動採番する。
	 * 
	 * @param newMessage
	 * @return
	 */
	@PostMapping
	Message postMessage(@RequestBody Message newMessage,@RequestHeader(name = "Authorization") String token) {
		// 簡易チェック
		if (newMessage == null || newMessage.getFromUserId() == null || newMessage.getFromUserId().equals("")) {
			throw new AccessDeniedException("fromUserId is invalid!!");
		}

		Message createdMessage = messageService.create(newMessage);
		return createdMessage;
	}
	@DeleteMapping
	void deleteMessage(@RequestBody int messageId, @RequestHeader(name = "Authorization") String token) {
		// 簡易認証
		if (token == null || token.equals("") ) {
			throw new AccessDeniedException("fromUserId is invalid!!");
		}
		messageService.delete(messageId);
	}
}
