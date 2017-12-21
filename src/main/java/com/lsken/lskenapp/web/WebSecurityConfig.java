package com.lsken.lskenapp.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import com.lsken.lskenapp.repository.UserRepository;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	UserRepository userRepository;
	
	@Override
	public void configure(WebSecurity web) {
		web.ignoring().antMatchers("/webjars/**","/css/**","/fonts/**","/html/**","/images/**","/js/**","/api/**","/h2-console/**","/stamps","/v2/api-docs.json","/v2/api-docs");
	}
	@Override
	public void configure(HttpSecurity http) throws Exception {
		http
		.authorizeRequests()
			.antMatchers("/resources/**").permitAll()
			.anyRequest().authenticated()
			.and()
		.formLogin()
			.loginProcessingUrl("/login")
			.loginPage("/loginForm")
			.permitAll()
			.usernameParameter("username")
            .passwordParameter("password")
			//.failureForwardUrl("/error")
			.defaultSuccessUrl("/",true)
			.and()
		.logout()
			.logoutUrl("/logout")
			.permitAll()
			.logoutSuccessUrl("/loginForm")
			.deleteCookies("JSESSIONID").invalidateHttpSession(true);
		
	}
	
	@Bean
	public UserDetailsService userDetailsService()  {
		InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
		
		// デバック用ユーザー
		manager.createUser(User.withUsername("user")
				.password("user")
				.roles("USER")
				.build());
		manager.createUser(User.withUsername("admin").
				password("admin").
				roles("USER","ADMIN").
				build());
		
		// Useテーブルの内容のユーザーの登録。パスワードはユーザーIDと同様とする
		List<com.lsken.lskenapp.domain.User> userList = userRepository.findAll();
		userList.forEach(user ->
		manager.createUser(User.withUsername(user.getUserId())
				.password(user.getUserId())
				.roles("USER")
				.build())
		);
		
		return manager;
	}
	  @Configuration
	    protected static class AuthenticationConfiguration extends GlobalAuthenticationConfigurerAdapter {
	        
		  @Autowired
		    private CustomAuthenticationProviderImpl authenticationProvider;
			
			@Override
		    public void init(AuthenticationManagerBuilder auth) throws Exception {
		    	// 認証方法を設定する
		    	auth.authenticationProvider(authenticationProvider);
		    }
	    }
            
}