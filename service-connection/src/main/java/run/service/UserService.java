package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.User;
import run.mapper.UserMapper;

import java.util.List;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    UserMapper userMapper;

    public User selectUserByUsername(String username){
        return userMapper.selectUserByUsername(username);
    }

    public int selectCountUserByUsername(String username){
        return userMapper.selectCountUserByUsername(username);
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
