package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import run.EncryptUtil;
import run.bean.User;
import run.redis.RedisTest;
import run.service.LoginService;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class LoginController {
    @Autowired
    LoginService loginService;
    @Autowired
    FeignForMQ feignForMQ;

    @RequestMapping(value = "/loginWeb",method = RequestMethod.POST)
    public Map<String,Object> login(@RequestBody User user, HttpServletRequest req) {
        String username = user.getUsername();
        String password = user.getPassword();
        Map<String,Object> param = new HashMap<>();
        System.out.println("username为： "+username+"====="+"password为： "+ EncryptUtil.encrypt(password));
        param.put("username",username);
        param.put("password", EncryptUtil.encrypt(password));
        List<Map<String,Object>> list = loginService.selectUser(param);
        System.out.println("返回的userlist为： "+list);
        Map<String,Object> resultMap = new HashMap<>();
        if(list.size()>0){
            //若redis已存在此用户，删除该用户
            RedisTest.searchForDel(username);
            //保持单点登录并通知前台
            String res = feignForMQ.pushToWebForLogin(username);
            if("success".equals(res)){
                RedisTest.addLoginUser(req.getSession().getId(),username);
                Map<String,Object> logParam = new HashMap<>();
                logParam.put("type","登录操作");
                logParam.put("userId",username);
                logParam.put("ip",getIpAddress(req));
                logParam.put("content","登录平台");
                loginService.insertLog(logParam);
            }else{
                resultMap.put("result","登录失败");
            }
            resultMap.put("result","登录成功");
            return resultMap;
        }else{
            resultMap.put("result","登录失败");
            return resultMap;
        }
    }

    @RequestMapping("/loginOut")
    public Map<String,Object> loginOut(HttpServletRequest req) {
        RedisTest.removeLoginUser(req.getSession().getId());
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("result","退出成功");
        return resultMap;
    }

    @RequestMapping("/getLoginUser")
    public Map<String,Object> getLoginUser(HttpServletRequest req) {
        String userId = RedisTest.getLoginUser(req.getSession().getId());
        System.out.println("userId : "+userId);
        Map<String,Object> param = new HashMap<>();
        param.put("userId",userId);
        return loginService.selectUserPower(param);
    }

    @RequestMapping(value = "/selectLogList",method = RequestMethod.GET)
    public Map<String,Object> selectLogList(HttpServletRequest req) {
        int start = Integer.parseInt(req.getParameter("start"));
        int limit = Integer.parseInt(req.getParameter("limit"));
        String type = req.getParameter("type");
        String userId = req.getParameter("userId");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");

        Map<String,Object> result = new HashMap<>();
        Map<String,Object> params = new HashMap<>();
        params.put("start",start);
        params.put("limit",limit);
        params.put("type",type);
        params.put("userId",userId);
        params.put("startTime",startTime);
        params.put("endTime",endTime);
        result.put("items",loginService.selectLogList(params));
        result.put("totals",loginService.selectLogListCount(params));
        return result;
    }

    /**
     * 日志调用服务
     */
    @RequestMapping(value = "/insertLog",method = RequestMethod.GET)
    public void insertLog(HttpServletRequest req) {
        String sessionId = req.getSession().getId();
        System.out.println("sessionId : "+sessionId);
        String userId = RedisTest.getLoginUser(sessionId);
        System.out.println("userId : "+userId);
        Map<String,Object> logParam = new HashMap<>();
        logParam.put("type",req.getParameter("type"));
        logParam.put("userId",userId);
        logParam.put("ip",getIpAddress(req));
        logParam.put("content",req.getParameter("content"));
        loginService.insertLog(logParam);
    }

    /**
     * 获取用户真实IP地址，不使用request.getRemoteAddr();的原因是有可能用户使用了代理软件方式避免真实IP地址,
     *
     * 可是，如果通过了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP值，究竟哪个才是真正的用户端的真实IP呢？
     * 答案是取X-Forwarded-For中第一个非unknown的有效IP字符串。
     *
     * 如：X-Forwarded-For：192.168.1.110, 192.168.1.120, 192.168.1.130,
     * 192.168.1.100
     *
     * 用户真实IP为： 192.168.1.110
     *
     * @param request
     * @return
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    @RequestMapping(value = "/selectMarquee",method = RequestMethod.GET)
    public Map<String,Object> selectMarquee(HttpServletRequest req) {
        Map<String,Object> param = new HashMap<>();
        param.put("data",RedisTest.searchMarquee());
        return param;
    }

    @RequestMapping(value = "/updateMarquee",method = RequestMethod.GET)
    public void updateMarquee(HttpServletRequest req) {
        String marquee = req.getParameter("marquee");
        RedisTest.updateMarquee(marquee);
    }

    public static void main(String[] args) {
        LoginController loginController = new LoginController();
        String path = loginController.getClass().getResource("/").getPath();
        System.out.println(path);

        String imgFile = path;
        InputStream in = null;
        byte[] data = null;
        try
        {
            in = new FileInputStream(imgFile);
            data = new byte[in.available()];
            in.read(data);
            in.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        Base64.Encoder encoder = Base64.getEncoder();
        System.out.println(encoder.encode(data));

        /*String filename = "templates/xhzh/JSsignature_pad/" + "text.txt";
        try {
            File imageFile = new File(filename);
            imageFile.createNewFile();
            if (!imageFile.exists()) {
                imageFile.createNewFile();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
    }

    /**
     * 解析base64并保存
     */
    @RequestMapping(value = "/uploadImg",method = RequestMethod.POST)
    public void uploadImg(HttpServletRequest req) {
        String imageFiles = req.getParameter("imgStr");
        Base64.Decoder decoder = Base64.getDecoder();
        byte[] imageByte = null;
        try {
            imageByte = decoder.decode(imageFiles);
            for (int i = 0; i < imageByte.length; ++i) {
                if (imageByte[i] < 0) {
                    imageByte[i] += 256;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        String files = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date()) + (new Random().nextInt(9000) % (9000 - 1000 + 1) + 1000) + ".png";
        String filename = this.getClass().getResource("/").getPath()+"static/xhzh/JSsignature_pad/" + files;
        try {
            File imageFile = new File(filename);
            imageFile.createNewFile();
            if (!imageFile.exists()) {
                imageFile.createNewFile();
            }else{
                imageFile.delete();
                imageFile.createNewFile();
            }
            OutputStream imageStream = new FileOutputStream(imageFile);
            imageStream.write(imageByte);
            imageStream.flush();
            imageStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
