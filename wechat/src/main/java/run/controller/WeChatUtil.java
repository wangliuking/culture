package run.controller;

import com.alibaba.fastjson.JSONObject;
import java.io.*;
import java.util.Date;
import java.util.Map;

public class WeChatUtil {
    //URL验证时使用的token
    public static final String TOKEN = "";
    //appid
    public static final String APPID = "wx75880fbb0c9e331a";
    //secret
    public static final String SECRET = "e2c23ba1e1f9ac8dc0084c15786b26ae";
    //创建菜单接口地址
    public static final String CREATE_MENU_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
    //获取access_token的接口地址
    public static final String GET_ACCESSTOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";
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
     * 创建自定义菜单
     * @param menu
     */
    public static void createMenu(String menu){
        JSONObject jsonObject = HttpsUtil.httpRequest(CREATE_MENU_URL.replace("ACCESS_TOKEN", getAccessToken()),"GET",menu);
        System.out.println(jsonObject);
    }

    public static void main(String[] args) {
        String menu = readJsonFile("/home/wlk/jdk/menu.json");
        createMenu(menu);
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

}
