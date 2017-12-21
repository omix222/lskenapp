package com.lsken.lskenapp.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.lsken.lskenapp.domain.User;
import com.lsken.lskenapp.repository.UserRepository;

public class CustomLoginFilter {

}

//extends UsernamePasswordAuthenticationFilter {
//	@Autowired
//	UserRepository userRepository;
//
//	@Override
//	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
//			throws AuthenticationException {
//
//		String username = super.obtainUsername(request);
//
//		User user = userRepository.findOne(username);
//		if (user == null || user.getUserName().isEmpty()) {
//			throw new AuthenticationServiceException("User Name is invalid.");
//		}
//
//		CustomUsernamePasswordAuthenticationToken authRequest = new CustomUsernamePasswordAuthenticationToken(username,
//				"");
//
//		setDetails(request, authRequest);
//
//		return this.getAuthenticationManager().authenticate(authRequest);
//	}
//
//	public class CustomUsernamePasswordAuthenticationToken extends UsernamePasswordAuthenticationToken {
//		private static final long serialVersionUID = 1L;
//
//		public CustomUsernamePasswordAuthenticationToken(Object principal, Object credentials) {
//			super(principal, credentials);
//		}
//	}
//}