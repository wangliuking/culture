package com.wlk.feign;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class AuthController {
    @Autowired
    FeignForAuth feignForAuth;

    @RequestMapping(value = "/hellos",method = RequestMethod.GET)
    public String hello(HttpServletRequest request, HttpServletResponse response){
        return feignForAuth.hello();
    }

    @RequestMapping(value = "/secureForResource",method = RequestMethod.GET)
    public List<String> secure(@RequestParam("access_token") String access_token){
        System.out.println(" access_token : "+access_token);
        return feignForAuth.secure(access_token);
    }

    @RequestMapping(value = "/auths",method = RequestMethod.GET)
    public String authToken(@RequestParam("username") String username,@RequestParam("password") String password){
        //System.out.println("username: "+username+" password: "+password+" grant_type: "+grant_type);
        String res = feignForAuth.authToken(username,password,"password");
        System.out.println("resultAAA : "+res);
        return res;
    }

    @RequestMapping(value = "/logout",method = RequestMethod.GET)
    public String logout(){
        String res = feignForAuth.logout();
        System.out.println("resultLogout : "+res);
        return res;
    }
}
