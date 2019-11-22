package run.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;

@Controller
@RequestMapping("/checkcenter")
public class CheckCenterController {
    private final Logger log = LoggerFactory.getLogger(CheckCenterController.class);
    //页面请求
    @GetMapping("/socket/{cid}")
    public ModelAndView socket(@PathVariable String cid) {
        ModelAndView mav = new ModelAndView("/socket");
        mav.addObject("cid", cid);
        return mav;
    }

    //推送数据接口
    @ResponseBody
    @RequestMapping("/socket/push/{cid}")
    public String pushToWeb(@PathVariable String cid, String message) {
        try {
            WebSocketServer.sendInfo(message, cid);
        } catch (IOException e) {
            e.printStackTrace();
            return "failure";
        }
        return "success";
    }

    //推送前台告知重新登录
    @ResponseBody
    @RequestMapping("/socket/pushForLogin/{sid}")
    public String pushToWebForLogin(@PathVariable String sid) {
        try {
            //告知前台需重新登录
            WebSocketServer.sendInfo("existUser", sid);
            //切断websocket连接
            WebSocketServer.closesid(sid);
        } catch (IOException e) {
            e.printStackTrace();
            return "failure";
        }
        return "success";
    }

    //广播接口，通知所有连接
    @ResponseBody
    @RequestMapping("/socket/broadcast")
    public String broadcast() {
        System.out.println("收到了广播通知");
        try {
            //告知前台需重新登录
            WebSocketServer.sendInfo("refresh", null);
        } catch (IOException e) {
            e.printStackTrace();
            return "failure";
        }
        return "success";
    }
}

