package com.lsken.lskenapp.web;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import com.lsken.lskenapp.domain.User;
import com.lsken.lskenapp.repository.UserRepository;

/**
 * 簡易認証実装クラス。
 * ユーザーIDのみチェック。パスワードはチェックしない。
 * 参考サイト。
 * http://m-shige1979.hatenablog.com/entry/2017/01/18/080000
 *
 */
@Component
public class CustomAuthenticationProviderImpl  implements AuthenticationProvider {
	
	@Autowired
	UserRepository userRepository;
	@Override
	public Authentication authenticate(Authentication auth) throws AuthenticationException {
		
		// ユーザーとパスワードを取得
		String id = auth.getName();
		
        // 未設定の場合はエラー
        if ("".equals(id) )  {
            // 例外はSpringSecurityにあったものを適当に使用
            throw new AuthenticationCredentialsNotFoundException("ログイン情報に不備があります。");
        }
        
        // 認証情報を取得
        User user = authCheck(id);
        if (user == null || user.getUserName().isEmpty()) {
        	throw new AuthenticationCredentialsNotFoundException("ログイン情報が存在しません。");
        }
		// トークンを返却
		return new UsernamePasswordAuthenticationToken(user, "", auth.getAuthorities());
	}

	@Override
	public boolean supports(Class<?> token) {
		return UsernamePasswordAuthenticationToken.class.isAssignableFrom(token);
	}
	
	private User authCheck(String username) {
		return userRepository.findOne(username);
	}


}