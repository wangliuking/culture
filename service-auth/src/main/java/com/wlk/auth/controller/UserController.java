package com.wlk.auth.controller;

import com.wlk.auth.entity.User;
import com.wlk.auth.service.UserService;
import com.wlk.auth.util.EncryptUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/selectUserList",method = RequestMethod.GET)
    public Map<String,Object> selectUserList(HttpServletRequest req) {
        String param = req.getParameter("param");
        int start = Integer.parseInt(req.getParameter("start"));
        int limit = Integer.parseInt(req.getParameter("limit"));

        Map<String,Object> result = new HashMap<>();
        Map<String,Object> params = new HashMap<>();
        params.put("param",param);
        params.put("start",start);
        params.put("limit",limit);
        result.put("items",userService.selectUserList(params));
        result.put("totals",userService.selectUserListCount(params));
        return result;
    }

    @RequestMapping(value = "/insertUser",method = RequestMethod.POST)
    public Map<String,Object> insertUser(@RequestBody User user) {
        user.setPassword(EncryptUtil.encrypt(user.getPassword()));
        int result = userService.insertUser(user);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了用户");
        }else {
            map.put("success",false);
            map.put("message","添加用户失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateUser",method = RequestMethod.POST)
    public Map<String,Object> updateUser(@RequestBody User user) {
        int result = userService.updateUser(user);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了用户");
        }else {
            map.put("success",false);
            map.put("message","更新用户失败");
        }
        return map;
    }

    @RequestMapping("/deleteUser")
    public Map<String, Object> deleteUser(HttpServletRequest req){
        int res = userService.deleteUser(req.getParameter("username"));
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了用户");
        }else {
            map.put("success",false);
            map.put("message","删除用户失败");
        }
        return map;
    }

}
