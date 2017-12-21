package com.lsken.lskenapp.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.MappedInterceptor;

public class ApiInterceptor implements HandlerInterceptor {
	
	// Controllerリクエスト前
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception
	{
		// Token(ユーザーID)を取得
		String authorization = request.getHeader("Authorization");
		if(authorization != null && !authorization.equals("")) {
			// これ以上のチェックはとりあえずしない
			return true;
		}
		
		// usersへのアクセスはURLはとりあえず許可
		String reqUri = new String(request.getRequestURI());
		if(reqUri.indexOf("/messages") < 0 && reqUri.indexOf("/groups") < 0 
				&& reqUri.indexOf("/stamps") < 0)
		{
			return true;
		}
		
		// 認証エラー(401)を返却
		response.setStatus(javax.servlet.http.HttpServletResponseWrapper.SC_UNAUTHORIZED);
		return false;
	}

	// ビューレンダリング前(RestControllerでは呼ばれない)
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO 自動生成されたメソッド・スタブ
	}

	// ビューレンダリング後(RestControllerでは呼ばれない)
	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO 自動生成されたメソッド・スタブ
		
	}
}

@Configuration
class InterceptorConfig{
	@Bean
	public ApiInterceptor apiInterceptor()
	{
		return new ApiInterceptor();
	}
	
	@Bean
	public MappedInterceptor interceptor()
	{
		return new MappedInterceptor(new String[] {"/**"}, apiInterceptor());
	}
}
