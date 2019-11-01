package com.wlk.auth.service;

import com.wlk.auth.entity.Authority;
import com.wlk.auth.entity.User;
import com.wlk.auth.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    UserMapper userMapper;

    public User selectUserByUsername(String username){
        return userMapper.selectUserByUsername(username);
    }

    public List<Authority> selectAuthByUsername(String username){
        return userMapper.selectAuthByUsername(username);
    }

    public List<Map<String,Object>> selectUserList(Map<String,Object> param){
        return userMapper.selectUserList(param);
    }

    public int selectUserListCount(Map<String,Object> param){
        return userMapper.selectUserListCount(param);
    }

    public int insertUser(User user){
        return userMapper.insertUser(user);
    }

    public int updateUser(User user){
        return userMapper.updateUser(user);
    }

    public int deleteUser(String username){
        return userMapper.deleteUser(username);
    }
}
