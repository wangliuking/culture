package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import run.entity.InMsgEntity;
import run.entity.OutMsgEntity;
import run.service.WeChatService;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class WeChatController {
    @Autowired
    private WeChatService totalService;
    @Autowired
    private FeignForStructure feignForStructure;

    /**
     * 测试
     */
    @RequestMapping(value="/test",method= RequestMethod.GET)
    public String test(){
        return "success";
    }

    /**
     * 微信URL接入验证
     * @param signature
     * @param timestamp
     * @param nonce
     * @param echostr
     * @return
     */
    @RequestMapping(value="/weChat",method= RequestMethod.GET)
    @ResponseBody
    public String validate(String signature,String timestamp,String nonce,String echostr){
        //1. 将token、timestamp、nonce三个参数进行字典序排序
        String[] arr = {timestamp,nonce,WeChatUtil.TOKEN};
        Arrays.sort(arr);
        //2. 将三个参数字符串拼接成一个字符串进行sha1加密
        StringBuilder sb = new StringBuilder();
        for (String temp : arr) {
            sb.append(temp);
        }
        //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        if(SecurityUtil.SHA1(sb.toString()).equals(signature)){
            //接入成功
            return echostr;
        }
        //接入失败
        return null;
    }

    /**
     * 微信消息处理
     */
    @RequestMapping(value="/weChat",method= RequestMethod.POST,produces= {MediaType.TEXT_XML_VALUE} )
    @ResponseBody
    public Object handleMessage(@RequestBody InMsgEntity msg){
        System.out.println("==============================================================");
        System.out.println(msg);
        System.out.println("--------------------------------------------------------------");
        //创建消息响应对象
        OutMsgEntity out = new OutMsgEntity();
        //把原来的发送方设置为接收方
        out.setToUserName(msg.getFromUserName());
        //把原来的接收方设置为发送方
        out.setFromUserName(msg.getToUserName());
        //获取接收的消息类型
        String msgType = msg.getMsgType();
        //设置消息的响应类型
        out.setMsgType(msgType);
        //设置消息创建时间
        out.setCreateTime(new Date().getTime());
        //公众号回复的内容
        String outContent = null;
        //根据类型设置不同的消息数据
        if("text".equals(msgType)){
            out.setContent(msg.getContent());
        }else if("image".equals(msgType)){
            out.setMediaId(new String[]{msg.getMediaId()});
        }else if("event".equals(msgType)){
            //判断关注事件
            if("subscribe".equals(msg.getEvent())){
                out.setContent("欢迎关注![愉快]");
                //设置消息的响应类型
                out.setMsgType("text");
            }
        }else if("click".equals(msg.getEvent())){
            //获取菜单的key值
            String key = msg.getEventKey();
            if("base".equals(key)){
                outContent = "当前基本情况如下：\n" +
                        "泸州市起义博物馆";
            }else if("new".equals(key)){
                outContent = "最新动态：\n" +
                        "市委书记李达康同志现场指导工作\n" +
                        "省委书记高育良同志开展党建工作";
            }
            //设置消息的响应类型
            out.setMsgType("text");
            out.setContent(outContent);
        }
        System.out.println(out);
        System.out.println("==============================================================");
        return out;
    }

    public static void main(String[] args) {
        OutMsgEntity out = new OutMsgEntity();
        //把原来的发送方设置为接收方
        out.setToUserName("wlk");
        //把原来的接收方设置为发送方
        out.setFromUserName("aaa");
        //获取接收的消息类型
        String msgType = "text";
        //设置消息的响应类型
        out.setMsgType(msgType);
        //设置消息创建时间
        out.setCreateTime(new Date().getTime());
        out.setContent("测试");
        System.out.println(out.toString());
    }
}
