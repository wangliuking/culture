package run.redis;

import redis.clients.jedis.Jedis;

import java.util.Iterator;
import java.util.Set;

public class RedisTest {
    private static String ip = "localhost";

    public static void main(String[] args) {
        //连接本地的 Redis 服务
        Jedis jedis = new Jedis(ip,6379);
        jedis.auth("XinHong12345");
        jedis.select(1);
        //jedis.del("5");
        //jedis.flushDB();
        Set<String> strs = jedis.keys("*");
        System.out.println("strs : "+strs);
        Iterator<String> it = strs.iterator();
        while(it.hasNext()){
            System.out.println(jedis.get(it.next()));
        }
        //jedis.flushAll();
        //System.out.println("Connection to server sucessfully");
        //查看服务是否运行
        //System.out.println("Server is running: "+jedis.ping());
        jedis.close();
    }

    public static boolean searchLoginUser(String sessionId){
        Jedis jedis = new Jedis(ip,6379);
        jedis.auth("XinHong12345");
        jedis.select(0);
        String result = jedis.get(sessionId);
        System.out.println("result :"+result);
        jedis.close();
        if(result != null && !"".equals(result)){
            return true;
        }else{
            return false;
        }

    }

    public static String getLoginUser(String sessionId){
        Jedis jedis = new Jedis(ip,6379);
        jedis.auth("XinHong12345");
        jedis.select(0);
        String result = jedis.get(sessionId);
        //System.out.println("result :"+result);
        jedis.close();
        if(result != null && !"".equals(result)){
            return result;
        }else{
            return "";
        }

    }

    public static void addLoginUser(String sessionId,String userId){
        Jedis jedis = new Jedis(ip,6379);
        jedis.auth("XinHong12345");
        jedis.select(0);
        jedis.set(sessionId,userId);
        jedis.expire(sessionId,3600*5);
        jedis.close();
    }

    public static void removeLoginUser(String sessionId){
        Jedis jedis = new Jedis(ip,6379);
        jedis.auth("XinHong12345");
        jedis.select(0);
        jedis.del(sessionId);
        jedis.close();
    }


}
