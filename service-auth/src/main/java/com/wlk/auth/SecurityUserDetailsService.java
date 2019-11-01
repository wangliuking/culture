package com.wlk.auth;

import com.wlk.auth.entity.Authority;
import com.wlk.auth.entity.User;
import com.wlk.auth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component("userDetailsService")
public class SecurityUserDetailsService implements UserDetailsService
{
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {

        System.out.println("login : "+login);
        String lowercaseLogin = login.toLowerCase();

        User userFromDatabase = userService.selectUserByUsername(lowercaseLogin);
        List<Authority> list = userService.selectAuthByUsername(lowercaseLogin);
        Set<Authority> set = new HashSet<>(list);
        userFromDatabase.setAuthorities(set);

        if (userFromDatabase == null) {
            throw new NewUserNotFoundException("User " + lowercaseLogin + " was not found in the database");
        }
        //获取用户的所有权限并且SpringSecurity需要的集合
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        for (Authority authority : userFromDatabase.getAuthorities()) {
            GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(authority.getName());
            grantedAuthorities.add(grantedAuthority);
        }
        //返回一个SpringSecurity需要的用户对象
        return new org.springframework.security.core.userdetails.User(
                userFromDatabase.getUsername(),
                userFromDatabase.getPassword(),
                grantedAuthorities);

    }
}
