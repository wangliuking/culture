package com.wlk.auth.controller;

import com.wlk.auth.entity.Role;
import com.wlk.auth.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RoleController {
    @Autowired
    private RoleService roleService;

    @RequestMapping(value = "/selectRoleList",method = RequestMethod.GET)
    public Map<String,Object> selectRoleList(HttpServletRequest req) {
        String param = req.getParameter("param");
        int start = Integer.parseInt(req.getParameter("start"));
        int limit = Integer.parseInt(req.getParameter("limit"));

        Map<String,Object> result = new HashMap<>();
        Map<String,Object> params = new HashMap<>();
        params.put("param",param);
        params.put("start",start);
        params.put("limit",limit);
        result.put("items",roleService.selectRoleList(params));
        result.put("totals",roleService.selectRoleListCount(params));
        return result;
    }

    @RequestMapping(value = "/insertRole",method = RequestMethod.POST)
    public Map<String,Object> insertRole(@RequestBody Role role) {
        int result = roleService.insertRole(role);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了用户组");
        }else {
            map.put("success",false);
            map.put("message","添加用户组失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateRole",method = RequestMethod.POST)
    public Map<String,Object> updateRole(@RequestBody Role role) {
        int result = roleService.updateRole(role);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了用户组");
        }else {
            map.put("success",false);
            map.put("message","更新用户组失败");
        }
        return map;
    }

    @RequestMapping("/deleteRole")
    public Map<String, Object> deleteRole(HttpServletRequest req){
        int res = roleService.deleteRole(Integer.parseInt(req.getParameter("id")));
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了用户组");
        }else {
            map.put("success",false);
            map.put("message","删除用户组失败");
        }
        return map;
    }

}
