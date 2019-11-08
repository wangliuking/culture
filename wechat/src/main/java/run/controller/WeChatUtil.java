package run.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.scheduling.annotation.Async;
import run.entity.article.ArticlesEntity;
import run.entity.article.BaseNews;
import run.entity.article.KfnewsEntity;

import javax.activation.MimetypesFileTypeMap;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

public class WeChatUtil {
    //测试IP
    public static final String IP = "39.104.184.219";
    //URL验证时使用的token
    public static final String TOKEN = "wangliukai";
    //appid
    public static final String APPID = "wxcced8da4bd3f91e7";
    //secret
    public static final String SECRET = "6291e359b6d163ba09c8195c7e0fb2fa";
    //创建菜单接口地址
    public static final String CREATE_MENU_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
    //获取access_token的接口地址
    public static final String GET_ACCESSTOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
    //获取网页授权accessToken的接口
    public static final String GET_WEB_ACCESSTOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
    //获取用户信息的接口
    public static final String GET_USERINFO_URL = "https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";

    //发送模板消息的接口
    public static final String SEND_TEMPLATE_URL = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";
    //发送图文消息的接口
    public static final String SEND_Articles_URL = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
    //获取所有图文素材
    public static final String GET_ALL_NEWS = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN";
    //缓存的access_token
    private static String accessToken;
    //access_token的失效时间
    private static long expiresTime;

    /**
     * 获取accessToken
     * @return
     */
    public static String getAccessToken(){
        //判断accessToken是否已经过期，如果过期需要重新获取
        if(accessToken==null || expiresTime < new Date().getTime()){
            //发起请求获取accessToken
            JSONObject jsonObject = HttpsUtil.httpRequest(GET_ACCESSTOKEN_URL.replace("APPID", APPID).replace("APPSECRET", SECRET),"GET",null);
            System.out.println("jsonObject : "+jsonObject);
            //缓存accessToken
            accessToken = jsonObject.getString("access_token");
            //设置accessToken的失效时间
            long expires_in = jsonObject.getLong("expires_in");
            //失效时间 = 当前时间 + 有效期(提前一分钟)
            expiresTime = new Date().getTime()+ (expires_in-60) * 1000;
            System.out.println("accessToken : "+accessToken);
        }
        return accessToken;
    }

    /**
     * 获取网页授权的AccessToken凭据
     * @return
     */
    public static JSONObject getWebAccessToken(String code){
        String url = GET_WEB_ACCESSTOKEN_URL.replace("APPID", APPID).replace("SECRET", SECRET).replace("CODE", code);
        System.out.println("执行获取web鉴权 ： ");
        System.out.println(url);
        JSONObject jsonObject = HttpsUtil.httpRequest(url,"GET",null);
        System.out.println("返回结果如下 ： ");
        System.out.println(jsonObject);
        return jsonObject;
    }

    /**
     * 获取用户信息
     *
     */
    public static JSONObject getUserInfo(String accessToken,String openId){
        String url = GET_USERINFO_URL.replace("ACCESS_TOKEN", accessToken).replace("OPENID",openId);
        System.out.println("执行获取web鉴权 ： ");
        System.out.println(url);
        JSONObject jsonObject = HttpsUtil.httpRequest(url,"GET",null);
        System.out.println("返回的用户信息为 ： ");
        System.out.println(jsonObject);
        return jsonObject;
    }

    /**
     * 获取所有图文素材列表
     * @return
     */
    public static JSONObject getNews(){
        String news = readJsonFile("/usr/wechat/news.json");
        String url = GET_ALL_NEWS.replace("ACCESS_TOKEN", getAccessToken());
        JSONObject jsonObject = HttpsUtil.httpRequest(url,"GET",news);
        System.out.println(jsonObject);
        return jsonObject;
    }

    /**
     * 发送模板
     *
     */
    @Async
    public void sendTemplate(String openId){
        String data = readJsonFile("/home/wlk/jdk/message.json");
        JSONObject js = JSONObject.parseObject(data);
        js.put("touser",openId);
        js.put("template_id","t6tPnmji-qHrbKJU4TFEpL3IzwPwO9MghdeEVpIgPqI");
        String d = JSONObject.toJSONString(js);
        String url = SEND_TEMPLATE_URL.replace("ACCESS_TOKEN", getAccessToken());
        JSONObject jsonObject = HttpsUtil.httpRequest(url,"GET",d);
        System.out.println(jsonObject);
    }

    /**
     * 创建自定义菜单
     */
    @Async
    public void createMenu(){
        String menu = readJsonFile("/usr/wechat/menu.json");
        String url = CREATE_MENU_URL.replace("ACCESS_TOKEN", getAccessToken());
        JSONObject jsonObject = HttpsUtil.httpRequest(url,"GET",menu);
        System.out.println(jsonObject);
    }

    /**
     * 创建图文模板
     */
    @Async
    public void createArticles(String openId){
        ArticlesEntity art1 = new ArticlesEntity();
        art1.setDescription("假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧！");
        art1.setPicurl("http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XAHdD2zH6TX4vmM8fbWkg6ToFoeaNDibwBdv93uLQDGyFpopb3ZTWsnvQ/0?wx_fmt=jpeg");
        art1.setTitle("图文信息1");
        art1.setUrl("http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=1&sn=06f79f3e8d11288509b25d1b6010d6ed&chksm=1f60144028179d561aac9d13536125f2407ddd7b5ccb456f27d1fb570a783a54388ab62c594d#rd");

        ArticlesEntity art2 = new ArticlesEntity();
        art2.setDescription("假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧！");
        art2.setPicurl("http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XAXMhNSu2eYMW6qvqpIwQHynz0anONTmo2gPjUmUwhXhlWt5OFgt8Xcw/0?wx_fmt=jpeg");
        art2.setTitle("图文信息2");
        art2.setUrl("http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=2&sn=b01fa4728445817c8e4c860a82724f46&chksm=1f60144028179d569a61e3c1d886e83cf6a8d0cebe1d1fe19fa12d1083acc002971f3741b569#rd");

        ArticlesEntity art3 = new ArticlesEntity();
        art3.setDescription("假如没有热情世界上任何伟大的事业都不会成功那么给我们一个支点用热情去撼动无限的未来吧！");
        art3.setPicurl("http://mmbiz.qpic.cn/mmbiz_jpg/RffFvrVAGucsuWdJPibt5QpmGLicZ6O8XA5o6B92hI6Q5mIOibUWgIFIsISheHBvIDaBypkhmGbwry1AArOlj95kw/0?wx_fmt=jpeg");
        art3.setTitle("图文信息3");
        art3.setUrl("http://mp.weixin.qq.com/s?__biz=MzA3NjQzMjQxNw==&mid=100000014&idx=3&sn=69500224fda99cdd0c2d9f2c4887e518&chksm=1f60144028179d56f1fe5380d0f977794237a373fe8afdc3c24e72ec9c2463a703d54d254ca4#rd");

        List<ArticlesEntity> list = new ArrayList<ArticlesEntity>();
        KfnewsEntity news = new KfnewsEntity();
        list.add(art1);
        list.add(art2);
        list.add(art3);
        news.setArticles(list);

        BaseNews kfbean = new BaseNews();
        kfbean.setMsgtype("news");
        kfbean.setTouser(openId);
        kfbean.setNews(news);

        String json = JSONObject.toJSONString(kfbean);

        JSONObject jsonObject = HttpsUtil.httpRequest(SEND_Articles_URL.replace("ACCESS_TOKEN", getAccessToken()),"GET",json);
        System.out.println(jsonObject);
    }


    public static void main(String[] args) {
        //WeChatUtil weChatUtil = new WeChatUtil();
        //weChatUtil.preview("ZvpyhZYoQVxcGhSa7DbmxlUKgSYhJzvZBG78jDeuaHqWe-7XCVeTfAOcER0_e4PP","o_1Lxv47Chw4I1nWjoXHK4Pwb0vA");
        /*String url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=XDjcXMx1Whmny-INzVGYw75zKjum340_r0ayC3VPvYpJPygLH4RIpmT55Ct-Bz92";
        url = url.replace("ACCESS_TOKEN", getAccessToken());
        //String data = readJsonFile("/home/wlk/jdk/news.json");
        JSONObject json = HttpsUtil.httpRequest(url,"GET",null);
        System.out.println(json);*/
    }

    /**
     * 测试上传png图片
     *
     */
    public static String testUploadImage(String path){
        String url = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=image";
        url = url.replace("ACCESS_TOKEN", getAccessToken());
        System.out.println(url);
        String fileName = path;
        Map<String, String> textMap = new HashMap<>();
        Map<String, String> fileMap = new HashMap<>();
        fileMap.put("upfile", fileName);
        String contentType = "";
        String ret = formUpload(url, textMap, fileMap,contentType);
        System.out.println(ret);
        String media_id = JSONObject.parseObject(ret).getString("media_id");
        return media_id;
    }

    /**Articles    是    图文消息，一个图文消息支持1到8条图文
     *thumb_media_id    是    图文消息缩略图的media_id，可以在基础支持-上传多媒体文件接口中获得
     *author    否    图文消息的作者
     *title    是    图文消息的标题
     *content_source_url    否    在图文消息页面点击“阅读原文”后的页面，受安全限制，如需跳转Appstore，可以使用itun.es或appsto.re的短链服务，并在短链后增加 #wechat_redirect 后缀。
     *content    是    图文消息页面的内容，支持HTML标签。具备微信支付权限的公众号，可以使用a标签，其他公众号不能使用，如需插入小程序卡片，可参考下文。
     *digest    否    图文消息的描述，如本字段为空，则默认抓取正文前64个字
     *show_cover_pic    否    是否显示封面，1为显示，0为不显示
     *need_open_comment    否    Uint32 是否打开评论，0不打开，1打开
     *only_fans_can_comment    否    Uint32 是否粉丝才可评论，0所有人可评论，1粉丝才可评论
     */
    public static String uploadnews(List<Map<String,Object>> list){
        JSONArray jsarray=new JSONArray();
        for(int i=list.size()-1;i>=0;i--){
            Map<String,Object> map = list.get(i);
            JSONObject js=new JSONObject();
            js.put("thumb_media_id", map.get("thumb_media_id"));
            js.put("author", map.get("author"));
            js.put("title", map.get("title"));
            js.put("content_source_url", "");
            js.put("content", map.get("content"));
            js.put("digest", "");
            js.put("show_cover_pic", "1");
            js.put("need_open_comment", "1");
            js.put("only_fans_can_comment", "0");

            jsarray.add(js);
        }

        JSONObject js=new JSONObject();
        js.put("articles", jsarray);

        String jsstring = JSONObject.toJSONString(js);
        System.out.println("jsstring ： "+jsstring);
        String url="https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token=ACCESS_TOKEN".replaceAll("ACCESS_TOKEN", getAccessToken());
        System.out.println(url);
        JSONObject newsjs = HttpsUtil.httpRequest(url, "POST", jsstring);
        System.out.println("newsjs ： "+newsjs);
        String newsmedia = newsjs.getString("media_id");
        return newsmedia;
    }

    @Async
    public void preview(String newsmedia,String openId){
        JSONObject j1=new JSONObject();
        j1.put("media_id", newsmedia);
        JSONObject j=new JSONObject();
        j.put("touser", openId);
        j.put("mpnews", j1);
        j.put("msgtype", "mpnews");
        System.out.println(JSONObject.toJSONString(j));
        String url="https://api.weixin.qq.com/cgi-bin/message/mass/preview?access_token=ACCESS_TOKEN".replace("ACCESS_TOKEN", getAccessToken());
        JSONObject jsonObject = HttpsUtil.httpRequest(url, "POST", JSONObject.toJSONString(j));
        System.out.println(jsonObject);
    }

    public static String readJsonFile(String fileName) {
        String jsonStr = "";
        try {
            File jsonFile = new File(fileName);
            FileReader fileReader = new FileReader(jsonFile);

            Reader reader = new InputStreamReader(new FileInputStream(jsonFile),"utf-8");
            int ch = 0;
            StringBuffer sb = new StringBuffer();
            while ((ch = reader.read()) != -1) {
                sb.append((char) ch);
            }
            fileReader.close();
            reader.close();
            jsonStr = sb.toString();
            return jsonStr;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 上传图片
     * @param urlStr
     * @param textMap
     * @param fileMap
     * @param contentType 没有传入文件类型默认采用application/octet-stream
     * contentType非空采用filename匹配默认的图片类型
     * @return 返回response数据
     */
    public static String formUpload(String urlStr, Map<String, String> textMap, Map<String, String> fileMap,String contentType) {
        String res = "";
        HttpURLConnection conn = null;
        // boundary就是request头和上传文件内容的分隔符
        String BOUNDARY = "---------------------------123821742118716";
        try {
            URL url = new URL(urlStr);
            conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(30000);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Connection", "Keep-Alive");
            conn.setRequestProperty("User-Agent",
                    "Mozilla/5.0 (Windows; U; Windows NT 6.1; zh-CN; rv:1.9.2.6)");
            conn.setRequestProperty("Content-Type",
                    "multipart/form-data; boundary=" + BOUNDARY);
            OutputStream out = new DataOutputStream(conn.getOutputStream());
            // text
            if (textMap != null) {
                StringBuffer strBuf = new StringBuffer();
                Iterator iter = textMap.entrySet().iterator();
                while (iter.hasNext()) {
                    Map.Entry entry = (Map.Entry) iter.next();
                    String inputName = (String) entry.getKey();
                    String inputValue = (String) entry.getValue();
                    if (inputValue == null) {
                        continue;
                    }
                    strBuf.append("\r\n").append("--").append(BOUNDARY)
                            .append("\r\n");
                    strBuf.append("Content-Disposition: form-data; name=\""
                            + inputName + "\"\r\n\r\n");
                    strBuf.append(inputValue);
                }
                out.write(strBuf.toString().getBytes());
            }
            // file
            if (fileMap != null) {
                Iterator iter = fileMap.entrySet().iterator();
                while (iter.hasNext()) {
                    Map.Entry entry = (Map.Entry) iter.next();
                    String inputName = (String) entry.getKey();
                    String inputValue = (String) entry.getValue();
                    if (inputValue == null) {
                        continue;
                    }
                    File file = new File(inputValue);
                    String filename = file.getName();

                    //没有传入文件类型，同时根据文件获取不到类型，默认采用application/octet-stream
                    contentType = new MimetypesFileTypeMap().getContentType(file);
                    //contentType非空采用filename匹配默认的图片类型
                    if(!"".equals(contentType)){
                        if (filename.endsWith(".png")) {
                            contentType = "image/png";
                        }else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".jpe")) {
                            contentType = "image/jpeg";
                        }else if (filename.endsWith(".gif")) {
                            contentType = "image/gif";
                        }else if (filename.endsWith(".ico")) {
                            contentType = "image/image/x-icon";
                        }
                    }
                    if (contentType == null || "".equals(contentType)) {
                        contentType = "application/octet-stream";
                    }
                    StringBuffer strBuf = new StringBuffer();
                    strBuf.append("\r\n").append("--").append(BOUNDARY)
                            .append("\r\n");
                    strBuf.append("Content-Disposition: form-data; name=\""
                            + inputName + "\"; filename=\"" + filename
                            + "\"\r\n");
                    strBuf.append("Content-Type:" + contentType + "\r\n\r\n");
                    out.write(strBuf.toString().getBytes());
                    DataInputStream in = new DataInputStream(
                            new FileInputStream(file));
                    int bytes = 0;
                    byte[] bufferOut = new byte[1024];
                    while ((bytes = in.read(bufferOut)) != -1) {
                        out.write(bufferOut, 0, bytes);
                    }
                    in.close();
                }
            }
            byte[] endData = ("\r\n--" + BOUNDARY + "--\r\n").getBytes();
            out.write(endData);
            out.flush();
            out.close();
            // 读取返回数据
            StringBuffer strBuf = new StringBuffer();
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    conn.getInputStream()));
            String line = null;
            while ((line = reader.readLine()) != null) {
                strBuf.append(line).append("\n");
            }
            res = strBuf.toString();
            reader.close();
            reader = null;
        } catch (Exception e) {
            System.out.println("发送POST请求出错。" + urlStr);
            e.printStackTrace();
        } finally {
            if (conn != null) {
                conn.disconnect();
                conn = null;
            }
        }
        return res;
    }
}
