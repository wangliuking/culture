package run.redis;

import net.sf.json.JSONObject;
import protobuf.SendUtil;
import protobuf.TestStrayConf;
import protobuf.jsonbean.DAInfo;
import protobuf.jsonbean.RS485Info;
import protobuf.jsonbean.RTUConfig;
import protobuf.jsonbean.USERInfo;
import redis.clients.jedis.Jedis;
import run.bean.Stray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RedisTest {
    public static void main(String[] args) {
        //连接本地的 Redis 服务
        Jedis jedis = new Jedis("localhost",6379);
        jedis.auth("XinHong12345");
        jedis.select(1);
        //jedis.set("1",strayConfJson.toString());
        //System.out.println("Connection to server sucessfully");
        //查看服务是否运行
        //System.out.println("Server is running: "+jedis.ping());
        String rtuString = jedis.get("7");
        System.out.println("rtuString : "+rtuString);
        jedis.close();
    }

    public static RTUConfig jsonToRTU(JSONObject jsonObject){
        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);
        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        return r;
    }

    public static Map<String,Integer> getRS485Id(RS485Info rs485Info){
        //提取485id start
        int rChanno = Integer.parseInt(rs485Info.getChanno());
        int tempRDeviceId = Integer.parseInt(rs485Info.getDeviceid());
        int rDeviceId = 0;
        if(tempRDeviceId > 255){
            //为接触式电阻,需要转换id
            String tempStr = Integer.toBinaryString(tempRDeviceId);
            StringBuilder stb = new StringBuilder(tempStr);
            //截取后八位再转十进制
            String str = stb.substring(4, stb.length());
            rDeviceId = Integer.parseInt(str,2);
        }else{
            rDeviceId = tempRDeviceId;
        }
        int rDeviceType = Integer.parseInt(rs485Info.getDevicetype());
        //提取485id end
        Map<String,Integer> map = new HashMap<>();
        map.put("channo",rChanno);
        map.put("deviceId",rDeviceId);
        map.put("deviceType",rDeviceType);
        return map;
    }

    public static void synRTUConf(JSONObject jsonObject){
        //json转化为RTUConfig对象
        RTUConfig r = jsonToRTU(jsonObject);
        String rtuId = r.getRtuId();

        //连接redis,通过rtuId查询是否存在该rtu配置
        Jedis jedis = new Jedis("localhost",6379);
        jedis.auth("XinHong12345");
        jedis.select(1);
        String rtuString = jedis.get(rtuId);
        if(!"".equals(rtuString) && rtuString != null){
            JSONObject jsonObj = JSONObject.fromObject(rtuString);
            RTUConfig rtu = jsonToRTU(jsonObj);
            System.out.println("r :"+r);
            System.out.println("rtu :"+rtu);
            //判断r是何种类型
            if(r.getRS485InfoList() != null && r.getRS485InfoList().size()>0){
                //为485类型
                RS485Info rs485Info = r.getRS485InfoList().get(0);
                Map<String,Integer> map1 = getRS485Id(rs485Info);
                int channo1 = map1.get("channo");
                int deviceId1 = map1.get("deviceId");
                int deviceType1 = map1.get("deviceType");
                //计数器,判断是否找到了设备 记录找到设备的index
                int index = -1;
                int operation = -1;
                List<RS485Info> rs485list = rtu.getRS485InfoList();
                loop1 : for (int i=0;i<rs485list.size();i++){
                    RS485Info Rs485Info = rs485list.get(i);
                    Map<String,Integer> map2 = getRS485Id(Rs485Info);
                    int channo2 = map2.get("channo");
                    int deviceId2 = map2.get("deviceId");
                    int deviceType2 = map2.get("deviceType");
                    if(channo1 == channo2 && deviceId1 == deviceId2 && deviceType1 == deviceType2){
                        //找到了相同的设备
                        int op1 = Integer.parseInt(rs485Info.getOp());
                        index = i;
                        operation = op1;
                        break loop1;
                    }
                }
                if(index != -1){
                    if(operation != 1){
                       //该项为更新,先删除后添加
                        rs485list.remove(index);
                        rs485list.add(rs485Info);
                    }else if(operation == 1){
                        //该项为删除
                        rs485list.remove(index);
                    }
                }else{
                    //没有找到相应设备,直接添加
                    rs485list.add(rs485Info);
                }
                rtu.setRS485InfoList(rs485list);
            }

            if(r.getDAInfoList() != null && r.getDAInfoList().size()>0){
                DAInfo daInfo = r.getDAInfoList().get(0);
                int channo1 = Integer.parseInt(daInfo.getChanno());
                //计数器,判断是否找到了设备 记录找到设备的index
                int index = -1;
                int operation = -1;
                List<DAInfo> daInfoList = rtu.getDAInfoList();
                loop2 : for (int i=0;i<daInfoList.size();i++){
                    DAInfo DAInfo = daInfoList.get(i);
                    int channo2 = Integer.parseInt(DAInfo.getChanno());
                    if(channo1 == channo2){
                        //找到了相同的设备
                        int op1 = Integer.parseInt(daInfo.getOp());
                        index = i;
                        operation = op1;
                        break loop2;
                    }
                }
                if(index != -1){
                    if(operation != 1){
                        //该项为更新,先删除后添加
                        daInfoList.remove(index);
                        daInfoList.add(daInfo);
                    }else if(operation == 1){
                        //该项为删除
                        daInfoList.remove(index);
                    }
                }else{
                    //没有找到相应设备,直接添加
                    daInfoList.add(daInfo);
                }
                rtu.setDAInfoList(daInfoList);

            }

            if(!"".equals(r.getDipolltime()) && r.getDipolltime() != null){
                //数字量
                rtu.setDipolltime(r.getDipolltime());
            }

            if(r.getUserInfo() != null && r.getUserInfo().getId() != null && !"".equals(r.getUserInfo().getId())){
                //userinfo
                rtu.setUserInfo(r.getUserInfo());
            }

            JSONObject finalJsonObj = JSONObject.fromObject(rtu);
            jedis.set(rtuId,finalJsonObj.toString());

        }else{
            jedis.set(rtuId,jsonObject.toString());
        }

        jedis.close();
    }
}
