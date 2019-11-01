package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.User;
import run.service.UserService;
import run.util.EncryptUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private StructureController structureController;

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

        String structure = req.getParameter("structure");
        List<Integer> strList = structureController.foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        params.put("strList",strList);

        result.put("items",userService.selectUserList(params));
        result.put("totals",userService.selectUserListCount(params));
        return result;
    }

    public static void UtilMail(User user){
        String str = user.getEmail();
        Pattern p = Pattern.compile("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
        Matcher m = p.matcher(str);
        if(m.find()){
            SendMail.sendMail(user);
        }else{
            System.out.println("邮箱格式非法");
        }
    }

    @RequestMapping(value = "/insertUser",method = RequestMethod.POST)
    public Map<String,Object> insertUser(@RequestBody User user) {
        String password = user.getPassword();
        user.setPassword(EncryptUtil.encrypt(password));
        int result = userService.insertUser(user);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了用户");
            user.setPassword(password);
            new Thread(()->{
                UtilMail(user);
            }).start();
        }else {
            map.put("success",false);
            map.put("message","添加用户失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateUser",method = RequestMethod.POST)
    public Map<String,Object> updateUser(@RequestBody User user) {
        String password = user.getPassword();
        user.setPassword(EncryptUtil.encrypt(password));
        int result = userService.updateUser(user);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了用户");
            user.setPassword(password);
            new Thread(()->{
                UtilMail(user);
            }).start();
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

    @RequestMapping("/selectUserByUsername")
    public Map<String, Object> selectUserByUsername(HttpServletRequest req) throws Exception{
        User user = userService.selectUserByUsername(req.getParameter("username"));
        user.setPassword(EncryptUtil.decrypt(user.getPassword()));
        Map<String,Object> map = new HashMap<>();
        map.put("item",user);
        return map;
    }

    @RequestMapping("/selectCountUserByUsername")
    public Map<String, Object> selectCountUserByUsername(HttpServletRequest req){
        int res = userService.selectCountUserByUsername(req.getParameter("username"));
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",false);
            map.put("message","已存在该用户");
        }else {
            map.put("success",true);
            map.put("message","可以使用");
        }
        return map;
    }

}
