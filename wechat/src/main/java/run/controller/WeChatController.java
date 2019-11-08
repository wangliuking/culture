package run.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import run.entity.InMsgEntity;
import run.entity.OutMsgEntity;
import run.service.WeChatService;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class WeChatController {
    @Autowired
    private WeChatService weChatService;

    /**
     * 发送新闻
     */
    @RequestMapping(value="/sendNews",method= RequestMethod.GET)
    @ResponseBody
    public void sendNews(){
        List<Map<String,Object>> list = weChatService.searchCurrentNews();
        for(int i=0;i<list.size();i++){
            Map<String,Object> map = list.get(i);
            String path = map.get("path")+"";
            String media_id =WeChatUtil.testUploadImage(path);
            map.put("thumb_media_id",media_id);
        }
        System.out.println(list);
        String newsmedia = WeChatUtil.uploadnews(list);
        WeChatUtil weChatUtil = new WeChatUtil();
        weChatUtil.preview(newsmedia,"o_1Lxv47Chw4I1nWjoXHK4Pwb0vA");
    }

    /**
     * 添加菜单
     */
    @RequestMapping(value="/addMenu",method= RequestMethod.GET)
    @ResponseBody
    public void addMenu(){
        WeChatUtil weChatUtil = new WeChatUtil();
        weChatUtil.createMenu();
    }

    /**
     * 获取图文素材
     */
    @RequestMapping(value="/getNews",method= RequestMethod.GET)
    @ResponseBody
    public Object getNews(){
       JSONObject jsonObject = WeChatUtil.getNews();
       JSONArray jsonArray = jsonObject.getJSONArray("item");
       for(int i=0;i<jsonArray.size();i++){
           JSONObject js = jsonArray.getJSONObject(i);
           String media_id = js.getString("media_id");
           if(media_id.equals("w-4TGEDAtnu7oYKICmt1rNGx22ibXV2ZTSrPTOHvTZ0")){
               List<Map<String,String>> list = new LinkedList<>();
               JSONArray itemArray = js.getJSONObject("content").getJSONArray("news_item");
               for(int j=0;j<itemArray.size();j++){
                   Map<String,String> map = new HashMap<>();
                   JSONObject item = itemArray.getJSONObject(j);
                   map.put("thumb_url",item.getString("thumb_url"));
                   map.put("title",item.getString("title"));
                   map.put("digest",item.getString("digest"));
                   map.put("url",item.getString("url"));
                   list.add(map);
               }
               return list;
           }
       }
       return "";
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
            //用户发送的内容
            String inContent = msg.getContent();
            //关键字判断
            if(inContent.contains("消息")){
                outContent = "最新动态消息请点击下方菜单\n" +
                        "最新动态";
            }else if(inContent.contains("关注")){
                outContent = "感谢您关注该公众号\n" +
                        "自动进行相关消息回复\n" +
                        "其他详细信息请点击下方菜单查看";
            }else{
                //用户发什么就回复什么
                outContent = inContent;
            }
            out.setContent(outContent);
        }else if("image".equals(msgType)){
            out.setMediaId(new String[]{msg.getMediaId()});
        }else if("event".equals(msgType)){
            //判断关注事件
            if("subscribe".equals(msg.getEvent())){
                out.setContent("欢迎关注![愉快]");
                //设置消息的响应类型
                out.setMsgType("text");
            }else if("CLICK".equals(msg.getEvent())){
                //获取菜单的key值
                String key = msg.getEventKey();
                if("base".equals(key)){
                    //发送模板消息
                    WeChatUtil weChatUtil = new WeChatUtil();
                    weChatUtil.sendTemplate(msg.getFromUserName());
                    System.out.println("不回复信息");
                    return "";
                }else if("new".equals(key)){
                    //发送图文消息
                    return "<xml>\n" +
                            "  <ToUserName>"+msg.getFromUserName()+"</ToUserName>" +
                            "  <FromUserName>"+msg.getToUserName()+"</FromUserName>" +
                            "  <CreateTime>"+new Date().getTime()+"</CreateTime>" +
                            "  <MsgType>news</MsgType>" +
                            "  <ArticleCount>3</ArticleCount>" +
                            "  <Articles>" +
                            "    <item>" +
                            "      <Title>图文信息1</Title>" +
                            "      <Description>假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧</Description>" +
                            "      <PicUrl>http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XAHdD2zH6TX4vmM8fbWkg6ToFoeaNDibwBdv93uLQDGyFpopb3ZTWsnvQ/0?wx_fmt=jpeg</PicUrl>" +
                            "      <Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=1&sn=06f79f3e8d11288509b25d1b6010d6ed&chksm=1f60144028179d561aac9d13536125f2407ddd7b5ccb456f27d1fb570a783a54388ab62c594d#rd]]></Url>" +
                            "    </item>" +
                            "    <item>" +
                            "      <Title>图文信息2</Title>" +
                            "      <Description>假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧</Description>" +
                            "      <PicUrl>http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XAXMhNSu2eYMW6qvqpIwQHynz0anONTmo2gPjUmUwhXhlWt5OFgt8Xcw/0?wx_fmt=jpeg</PicUrl>" +
                            "      <Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=2&sn=b01fa4728445817c8e4c860a82724f46&chksm=1f60144028179d569a61e3c1d886e83cf6a8d0cebe1d1fe19fa12d1083acc002971f3741b569#rd]]></Url>" +
                            "    </item>" +
                            "    <item>" +
                            "      <Title>图文信息3</Title>" +
                            "      <Description>假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧</Description>" +
                            "      <PicUrl>http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XA5o6B92hI6Q5mIOibUWgIFIsISheHBvIDaBypkhmGbwry1AArOlj95kw/0?wx_fmt=jpeg</PicUrl>" +
                            "      <Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=3&sn=69500224fda99cdd0c2d9f2c4887e518&chksm=1f60144028179d56f1fe5380d0f977794237a373fe8afdc3c24e72ec9c2463a703d54d254ca4#rd]]></Url>" +
                            "    </item>" +
                            "  </Articles>" +
                            "</xml>";
                }
                //设置消息的响应类型
                out.setMsgType("text");
                out.setContent(outContent);
            }
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

    /**
     * 图片列表页面
     */
    @RequestMapping(value="/list",method= RequestMethod.GET)
    public String list(String code,Model model){
        Map<String,Object> param = new HashMap<>();
        param.put("title","");
        List<Map<String,Object>> list = weChatService.selectAllList(param);
        for(Map<String,Object> map : list){
            String id = map.get("id")+"";
            map.put("id","detail?id="+id);
        }
        model.addAttribute("list",list);
        return "list";
    }

    /**
     * 图片列表页面
     */
    @RequestMapping(value="/detail",method= RequestMethod.GET)
    public String detail(String id,Model model){
        Map<String,Object> param = new HashMap<>();
        param.put("id",id);
        Map<String,Object> map = weChatService.searchDetail(param);
        String imgUrl = map.get("imgUrl")+"";
        List<String> imgUrlList = Arrays.asList(imgUrl.split(";"));
        String imgDesc = map.get("imgDesc")+"";
        List<String> imgDescList = Arrays.asList(imgDesc.split(";"));
        List<Map<String,String>> list = new LinkedList<>();
        for(int i=0;i<imgUrlList.size();i++){
            Map<String,String> m = new HashMap<>();
            m.put("imgUrl",imgUrlList.get(i));
            if(imgDescList.size()>i){
                m.put("imgDesc",imgDescList.get(i));
            }else{
                m.put("imgDesc","");
            }
            list.add(m);
        }
        map.put("list",list);
        model.addAttribute("map",map);
        return "detail";
    }
}
