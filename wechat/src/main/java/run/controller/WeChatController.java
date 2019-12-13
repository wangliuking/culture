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
import java.util.stream.Collectors;

@Controller
public class WeChatController {
    @Autowired
    private WeChatService weChatService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private MyApplicationRunner myApplicationRunner;
    /**
     * 外部数据接口
     */
    @RequestMapping(value="/getData",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getData(){
        JSONObject jsonObject = WeChatUtil.getUserList();
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("user",jsonObject.getString("total"));

        String time = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        Map<String,Object> param = new HashMap<>();
        param.put("startTime",time+" 00:00:00");
        param.put("endTime",time+" 23:59:59");
        resultMap.put("click",weChatService.searchClickNum(param).size());

        return resultMap;
    }
    /**
     * 获取所有关注用户
     */
    @RequestMapping(value="/getUserList",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getUserList(){
       JSONObject jsonObject = WeChatUtil.getUserList();
        System.out.println(jsonObject);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("user",jsonObject.getString("total"));
        return resultMap;
    }

    /**
     * 获取当日点击次数
     */
    @RequestMapping(value="/dayClickNum",method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> dayClickNum(){
        String time = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        Map<String,Object> param = new HashMap<>();
        param.put("startTime",time+" 00:00:00");
        param.put("endTime",time+" 23:59:59");
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("click",weChatService.searchClickNum(param).size());
        return resultMap;
    }

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
    public Object getNewsWeb(){
       JSONObject jsonObject = WeChatUtil.getNews();
       JSONArray jsonArray = jsonObject.getJSONArray("item");
       Map<String,Object> resultMap = new HashMap<>();
       for(int i=0;i<jsonArray.size();i++){
           JSONObject js = jsonArray.getJSONObject(i);
           String media_id = js.getString("media_id");
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
           resultMap.put(media_id,list);
       }
       return jsonObject;
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
                //广播页面
                //feignForMQ.broadcast();
                out.setContent("欢迎关注![愉快]");
                //设置消息的响应类型
                out.setMsgType("text");
            }else if("unsubscribe".equals(msg.getEvent())){
                //广播页面
                //feignForMQ.broadcast();
                out.setContent("取消关注!");
                //设置消息的响应类型
                out.setMsgType("text");
            }else if("CLICK".equals(msg.getEvent())){
                //获取菜单的key值
                String key = msg.getEventKey();
                Map<String,Object> param = new HashMap<>();
                param.put("openId",msg.getFromUserName());
                param.put("type",key);
                weChatService.insertClickNum(param);
                //广播页面
                //feignForMQ.broadcast();
                switch (key){
                    case "base":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rJFFnbvI35vTiSfqbBMlIyc");
                    case "show":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rLTRANZ9-6hYm4GrbqJBCuw");
                    case "word":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rOE2ke2VC4GOHea9gPU1KNg");
                    case "work":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rJDaAtVM1snxgTicxDtlzC0");
                    case "teach":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rF-ivi9jEd7Wt-LZMrCUcKI");
                    case "watch":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rNIsqDl54fl9pmT1oVQ6Uow");
                    case "info":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rNGyJUwN6aE7e-qIZijlGBk");
                    case "news":
                        return getNewsNow(msg,"【最新资讯】");
                    case "activity":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rCFtbFu6VGiu0YbxfWR4Q7M");
                    case "rpc":
                        return getNews(msg,"w-4TGEDAtnu7oYKICmt1rGUZLzHcVF-aaqw0D1s4_Jk");
                }
                /*if("base".equals(key)){
                    //发送模板消息
                    WeChatUtil weChatUtil = new WeChatUtil();
                    weChatUtil.sendTemplate(msg.getFromUserName());
                    System.out.println("不回复信息");
                    return "";
                }else if("new".equals(key)){
                    //发送图文消息

                }*/
                //设置消息的响应类型
                out.setMsgType("text");
                out.setContent(outContent);
            }
        }
        System.out.println(out);
        System.out.println("==============================================================");
        return out;
    }

    public String getNews(InMsgEntity msg,String str){
        JSONArray jsonArray = myApplicationRunner.jsonObject.getJSONArray("item");
        for(int i=0;i<jsonArray.size();i++){
            JSONObject js = jsonArray.getJSONObject(i);
            String media_id = js.getString("media_id");
            if(media_id.equals(str)){
                JSONArray itemArray = js.getJSONObject("content").getJSONArray("news_item");

                String itemStr = "";
                for(int j=0;j<itemArray.size();j++){
                    JSONObject item = itemArray.getJSONObject(j);
                    itemStr += "<item>" +
                    "<Title>"+item.getString("title")+"</Title>" +
                    "<Description>"+item.getString("digest")+"</Description>" +
                    "<PicUrl><![CDATA["+item.getString("thumb_url")+"]]></PicUrl>" +
                    "<Url><![CDATA["+item.getString("url")+"]]></Url>" +
                    "</item>";
                }

                int size = itemArray.size();
                return "<xml>\n" +
                        "<ToUserName>"+msg.getFromUserName()+"</ToUserName>" +
                        "<FromUserName>"+msg.getToUserName()+"</FromUserName>" +
                        "<CreateTime>"+new Date().getTime()+"</CreateTime>" +
                        "<MsgType>news</MsgType>" +
                        "<ArticleCount>"+size+"</ArticleCount>" +
                        "<Articles>" + itemStr +

                        /*"<item>" +
                        "<Title></Title>" +
                        "<Description></Description>" +
                        "<PicUrl></PicUrl>" +
                        "<Url></Url>" +
                        "</item>" +*/

                        "</Articles>" +
                        "</xml>";
            }
        }
        return null;
    }

    public String getNewsNow(InMsgEntity msg,String str){
        myApplicationRunner.scheduledInit();
        JSONArray jsonArray = myApplicationRunner.jsonObject.getJSONArray("item");
        String itemStr = "";
        Map<Long,String> map = new HashMap<>();
        List<Long> list = new LinkedList<>();
        for(int i=0;i<jsonArray.size();i++){
            JSONObject js = jsonArray.getJSONObject(i);
            long update_time = Long.parseLong(js.getString("update_time"));
            JSONArray itemArray = js.getJSONObject("content").getJSONArray("news_item");
            for(int j=0;j<itemArray.size();j++) {
                JSONObject item = itemArray.getJSONObject(j);
                String title = item.getString("title");
                if(title.contains(str)){
                    String tempStr = "<item>" +
                            "<Title>"+item.getString("title").replace(str,"")+"</Title>" +
                            "<Description>"+item.getString("digest")+"</Description>" +
                            "<PicUrl><![CDATA["+item.getString("thumb_url")+"]]></PicUrl>" +
                            "<Url><![CDATA["+item.getString("url")+"]]></Url>" +
                            "</item>";

                    map.put(update_time,tempStr);
                    list.add(update_time);
                }
            }

        }

        List<Long> collect = list.stream().sorted(Comparator.reverseOrder()).collect(Collectors.toList());
        for(int i=0;i<3;i++){
            Long key = collect.get(i);
            String val = map.get(key);
            itemStr += val;
        }

        int size = 3;
        return "<xml>\n" +
                "<ToUserName>"+msg.getFromUserName()+"</ToUserName>" +
                "<FromUserName>"+msg.getToUserName()+"</FromUserName>" +
                "<CreateTime>"+new Date().getTime()+"</CreateTime>" +
                "<MsgType>news</MsgType>" +
                "<ArticleCount>"+size+"</ArticleCount>" +
                "<Articles>" + itemStr +
                "</Articles>" +
                "</xml>";
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
     * 列表页面
     */
    @RequestMapping(value="/list",method= RequestMethod.GET)
    public String list(Model model){
        Map<String,Object> param = new HashMap<>();
        param.put("title","");
        List<Map<String,Object>> list = weChatService.selectAllList(param);
        for(Map<String,Object> map : list){
            String id = map.get("id")+"";
            map.put("id","sublist?pid="+id);
        }
        model.addAttribute("list",list);
        return "list";
    }

    /**
     * 子列表页面
     */
    @RequestMapping(value="/sublist",method= RequestMethod.GET)
    public String sublist(String pid,Model model){
        Map<String,Object> param = new HashMap<>();
        param.put("title","");
        param.put("pid",pid);
        List<Map<String,Object>> list = weChatService.selectAllSubList(param);
        for(Map<String,Object> map : list){
            String id = map.get("id")+"";
            map.put("id","detail?id="+id);
        }
        model.addAttribute("list",list);
        model.addAttribute("pTitle",list.get(0).get("pTitle"));
        model.addAttribute("pContent",list.get(0).get("pContent"));
        return "sublist";
    }

    /**
     * 详情
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
        if(Integer.parseInt(id)>13){
            return "movie";
        }
        return "detail";
    }
}
