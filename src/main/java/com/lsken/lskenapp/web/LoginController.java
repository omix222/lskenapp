package com.lsken.lskenapp.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class LoginController
{
    public static final String PAGE = "/loginForm";
    private static final String HTML = "loginForm";

    @RequestMapping(value = LoginController.PAGE)
    public String top(Model model)
    {
        return LoginController.HTML;
    }
    
}
