package com.wlk.auth.controller;

import com.wlk.auth.entity.Group;
import com.wlk.auth.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class GroupController {
    @Autowired
    private GroupService groupService;

    @RequestMapping(value = "/selectGroupList",method = RequestMethod.GET)
    public Map<String,Object> selectGroupList(HttpServletRequest req) {
        String param = req.getParameter("param");
        int start = Integer.parseInt(req.getParameter("start"));
        int limit = Integer.parseInt(req.getParameter("limit"));

        Map<String,Object> result = new HashMap<>();
        Map<String,Object> params = new HashMap<>();
        params.put("param",param);
        params.put("start",start);
        params.put("limit",limit);
        result.put("items",groupService.selectGroupList(params));
        result.put("totals",groupService.selectGroupListCount(params));
        return result;
    }

    @RequestMapping(value = "/insertGroup",method = RequestMethod.POST)
    public Map<String,Object> insertGroup(@RequestBody Group group) {
        int result = groupService.insertGroup(group);
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

    @RequestMapping(value = "/updateGroup",method = RequestMethod.POST)
    public Map<String,Object> updateGroup(@RequestBody Group group) {
        int result = groupService.updateGroup(group);
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

    @RequestMapping("/deleteGroup")
    public Map<String, Object> deleteGroup(HttpServletRequest req){
        int res = groupService.deleteGroup(Integer.parseInt(req.getParameter("id")));
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
