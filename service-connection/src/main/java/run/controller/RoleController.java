package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.Role;
import run.service.RoleService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RoleController {
    @Autowired
    private RoleService roleService;
    @Autowired
    private StructureController structureController;

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

        String structure = req.getParameter("structure");
        List<Integer> strList = structureController.foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        params.put("strList",strList);

        result.put("items",roleService.selectRoleList(params));
        result.put("totals",roleService.selectRoleListCount(params));
        return result;
    }

    @RequestMapping(value = "/selectRoleById",method = RequestMethod.GET)
    public Map<String,Object> selectRoleById(HttpServletRequest req) {
        String id = req.getParameter("id");
        Map<String,Object> result = new HashMap<>();
        result.put("items",roleService.selectRoleById(Integer.parseInt(id)));
        return result;
    }

    @RequestMapping(value = "/insertRole",method = RequestMethod.POST)
    public Map<String,Object> insertRole(@RequestBody Role role) {
        int result = roleService.insertRole(role);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了角色");
        }else {
            map.put("success",false);
            map.put("message","添加角色失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateRoleName",method = RequestMethod.POST)
    public Map<String,Object> updateRoleName(@RequestBody Role role) {
        int result = roleService.updateRoleName(role);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","更新成功");
        }else {
            map.put("success",false);
            map.put("message","更新失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateRole",method = RequestMethod.POST)
    public Map<String,Object> updateRole(@RequestBody Role role) {
        int result = roleService.updateRole(role);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了菜单权限，请刷新页面");
        }else {
            map.put("success",false);
            map.put("message","保存失败");
        }
        return map;
    }

    @RequestMapping("/deleteRole")
    public Map<String, Object> deleteRole(HttpServletRequest req){
        int res = roleService.deleteRole(Integer.parseInt(req.getParameter("id")));
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了角色");
        }else {
            map.put("success",false);
            map.put("message","删除角色失败");
        }
        return map;
    }

}
