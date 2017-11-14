package com.lsken.lskenapp.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Override
	public void configure(WebSecurity web) {
		web.ignoring().antMatchers("/webjars/**","/css/**","/fonts/**","/html/**","/images/**","/js/**","/messages");
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
			.failureForwardUrl("/loginForm?error")
			.defaultSuccessUrl("/messagelist",true)
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
		manager.createUser(User.withUsername("user")
				.password("user")
				.roles("USER")
				.build());
		manager.createUser(User.withUsername("admin").
				password("admin").
				roles("USER","ADMIN").
				build());
		return manager;
	}
	
}