package run.controller;

import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import protobuf.*;
import protobuf.jsonbean.*;
import run.bean.*;
import run.redis.RedisTest;
import run.service.ConfService;
import run.service.ETCRService;
import run.service.RTUService;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class SendController {
    private final Logger log = LoggerFactory.getLogger(SendController.class);
    private static ConcurrentHashMap<String,JSONObject> map = new ConcurrentHashMap<>();

    public static void putMap(String key,JSONObject jsonObject){
        map.put(key,jsonObject);
    }

    public static void removeMap(String key){
        map.remove(key);
    }

    @Autowired
    private RTUService rtuService;
    @Autowired
    private ETCRService etcrService;
    @Autowired
    private ConfService confService;


    @RequestMapping(value = "/sendRTUConf", method = RequestMethod.POST)
    public void sendRTUConf(@RequestBody RTU rtu){
        log.info("调用mq发送rtu配置信息");
        try {
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu);
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info("要发送底端的信息为： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            /*String result = search(rtuConfJson);
            return result;*/

        }catch (Exception e){
            log.info("发送rtu配置请求到mq出错!!!");
            e.printStackTrace();
        }
        //return "未找到对应返回消息";
    }

    @RequestMapping(value = "/sendRtuDelNewConf", method = RequestMethod.POST)
    public void sendRtuDelNewConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送RtuDelNewConf配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject rtuNewDelConfJson = TestRtuNewDelConf.rtuNewDelConf(rtu,op);

            log.info("要发送rtuNewDelConf配置的信息为： "+rtuNewDelConfJson);
            SendUtil.sendMQ(rtuNewDelConfJson, Conf.ip_port,Conf.w2z_RtuConf);
        }catch (Exception e){
            log.info("发送rtuNewDelConf配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendSPDConf", method = RequestMethod.POST)
    public void sendSPDConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送spd配置信息");
        try {
            JSONObject spdObject = JSONObject.fromObject(map.get("spd"));
            SPD spd = (SPD)JSONObject.toBean(spdObject,SPD.class);
            JSONObject spdConfJson = TestSPDConf.spdConf(spd);
            log.info("要发送spd配置的信息为： "+spdConfJson);
            SendUtil.sendMQ(spdConfJson, Conf.ip_port,Conf.w2z_spd);
        }catch (Exception e){
            log.info("发送spd配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendSPDConfForRTU", method = RequestMethod.POST)
    public String sendSPDConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject spdObject = JSONObject.fromObject(map.get("spd"));
            SPD spd = (SPD)JSONObject.toBean(spdObject,SPD.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,spd);
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info("要发送底端的信息为： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);
            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送spd配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendETCRConf", method = RequestMethod.POST)
    public void sendETCRConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送etcr(接触式)配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject etcrObject = JSONObject.fromObject(map.get("etcr"));
            ETCR etcr = (ETCR)JSONObject.toBean(etcrObject,ETCR.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject etcrConfJson = TestETCRConf.etcrConf(etcr,op);
            log.info(" 发送的etcr配置为 ： "+etcrConfJson);
            SendUtil.sendMQ(etcrConfJson, Conf.ip_port,Conf.w2z_etcr);
        }catch (Exception e){
            log.info("发送etcr配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendETCRBConf", method = RequestMethod.POST)
    public void sendETCRBConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送etcr(非接触式)配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject etcrObject = JSONObject.fromObject(map.get("etcr"));
            ETCR etcr = (ETCR)JSONObject.toBean(etcrObject,ETCR.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject etcrConfJson = TestETCRBConf.etcrBConf(etcr,op);
            log.info(" 发送的etcr配置为 ： "+etcrConfJson);
            SendUtil.sendMQ(etcrConfJson, Conf.ip_port,Conf.w2z_EtcrBConf);
        }catch (Exception e){
            log.info("发送etcr配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendETCRConfForRTU", method = RequestMethod.POST)
    public String sendETCRConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject etcrObject = JSONObject.fromObject(map.get("etcr"));
            ETCR etcr = (ETCR)JSONObject.toBean(etcrObject,ETCR.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,etcr,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);
            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送etcr配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendLightningConf", method = RequestMethod.POST)
    public void sendLightningConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送lightning配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject lightningObject = JSONObject.fromObject(map.get("lightning"));
            Lightning lightning = (Lightning)JSONObject.toBean(lightningObject,Lightning.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject lightningConfJson = TestLightningConf.lightningConf(lightning,op);
            log.info(" 发送的lightning配置为 ： "+lightningConfJson);
            SendUtil.sendMQ(lightningConfJson, Conf.ip_port,Conf.w2z_lightning);
        }catch (Exception e){
            log.info("发送lightning配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendLightningConfForRTU", method = RequestMethod.POST)
    public String sendLightningConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject lightningObject = JSONObject.fromObject(map.get("lightning"));
            Lightning lightning = (Lightning)JSONObject.toBean(lightningObject,Lightning.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,lightning,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送lightning配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendStaticConf", method = RequestMethod.POST)
    public void sendStaticConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送static配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject staticObject = JSONObject.fromObject(map.get("Static"));
            Static Static = (Static)JSONObject.toBean(staticObject,Static.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject staticConfJson = TestStaticConf.staticConf(Static,op);
            log.info(" 发送的static配置为 ： "+staticConfJson);
            SendUtil.sendMQ(staticConfJson, Conf.ip_port,Conf.w2z_MemsConf);
        }catch (Exception e){
            log.info("发送static配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendStaticConfForRTU", method = RequestMethod.POST)
    public String sendStaticConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject staticObject = JSONObject.fromObject(map.get("Static"));
            Static Static = (Static)JSONObject.toBean(staticObject,Static.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,Static,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送static配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendRswsConf", method = RequestMethod.POST)
    public void sendRswsConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送rsws配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject rswsObject = JSONObject.fromObject(map.get("rsws"));
            Rsws rsws = (Rsws)JSONObject.toBean(rswsObject,Rsws.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject rswsConfJson = TestRswsConf.rswsConf(rsws,op);
            log.info(" 发送的rsws配置为 ： "+rswsConfJson);
            SendUtil.sendMQ(rswsConfJson, Conf.ip_port,Conf.w2z_RswsConf);
        }catch (Exception e){
            log.info("发送rsws配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendRswsConfForRTU", method = RequestMethod.POST)
    public String sendRswsConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject rswsObject = JSONObject.fromObject(map.get("rsws"));
            Rsws rsws = (Rsws)JSONObject.toBean(rswsObject,Rsws.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,rsws,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送rsws配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendSvtConf", method = RequestMethod.POST)
    public void sendSvtConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送svt配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject svtObject = JSONObject.fromObject(map.get("svt"));
            Svt svt = (Svt)JSONObject.toBean(svtObject,Svt.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject svtConfJson = TestSvtConf.svtConf(svt,op);
            log.info(" 发送的svt配置为 ： "+svtConfJson);
            SendUtil.sendMQ(svtConfJson, Conf.ip_port,Conf.w2z_SvtConf);
        }catch (Exception e){
            log.info("发送svt配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendSvtConfForRTU", method = RequestMethod.POST)
    public String sendSvtConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject svtObject = JSONObject.fromObject(map.get("svt"));
            Svt svt = (Svt)JSONObject.toBean(svtObject,Svt.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,svt,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送svt配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendHcConf", method = RequestMethod.POST)
    public void sendHcConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送hc配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject hcObject = JSONObject.fromObject(map.get("hc"));
            Hc hc = (Hc)JSONObject.toBean(hcObject,Hc.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject hcConfJson = TestHcConf.hcConf(hc,op);
            log.info(" 发送的hc配置为 ： "+hcConfJson);
            SendUtil.sendMQ(hcConfJson, Conf.ip_port,Conf.w2z_HcConf);
        }catch (Exception e){
            log.info("发送hc配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendHcConfForRTU", method = RequestMethod.POST)
    public String sendHcConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject hcObject = JSONObject.fromObject(map.get("hc"));
            Hc hc = (Hc)JSONObject.toBean(hcObject,Hc.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,hc,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送hc配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendStrayConf", method = RequestMethod.POST)
    public void sendStrayConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送stray配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject strayObject = JSONObject.fromObject(map.get("stray"));
            Stray stray = (Stray)JSONObject.toBean(strayObject,Stray.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject strayConfJson = TestStrayConf.strayConf(stray,op);
            log.info(" 发送的stray配置为 ： "+strayConfJson);
            SendUtil.sendMQ(strayConfJson, Conf.ip_port,Conf.w2z_StrayConf);
        }catch (Exception e){
            log.info("发送stray配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendStrayConfForRTU", method = RequestMethod.POST)
    public String sendStrayConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject strayObject = JSONObject.fromObject(map.get("stray"));
            Stray stray = (Stray)JSONObject.toBean(strayObject,Stray.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,stray,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送stray配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }

    @RequestMapping(value = "/sendCatConf", method = RequestMethod.POST)
    public void sendCatConf(@RequestBody Map<String,Object> map){
        log.info("调用mq发送cat配置信息");
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject catObject = JSONObject.fromObject(map.get("cat"));
            Cat cat = (Cat)JSONObject.toBean(catObject,Cat.class);
            int op = Integer.parseInt(map.get("op").toString());
            JSONObject catConfJson = TestCatConf.catConf(cat,op);
            log.info(" 发送的cat配置为 ： "+catConfJson);
            SendUtil.sendMQ(catConfJson, Conf.ip_port,Conf.w2z_CathodeConf);
        }catch (Exception e){
            log.info("发送cat配置请求到mq出错!!!");
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/sendCatConfForRTU", method = RequestMethod.POST)
    public String sendCatConfForRTU(@RequestBody Map<String,Object> map){
        try {
            JSONObject rtuObject = JSONObject.fromObject(map.get("rtu"));
            RTU rtu = (RTU)JSONObject.toBean(rtuObject,RTU.class);
            JSONObject catObject = JSONObject.fromObject(map.get("cat"));
            Cat cat = (Cat)JSONObject.toBean(catObject,Cat.class);
            JSONObject rtuConfJson = TestRTUConf.rtuConf(rtu,cat,map.get("op").toString());
            //发送redis
            RedisTest.synRTUConf(rtuConfJson);
            log.info(" 发送到底端的配置为 ： "+rtuConfJson);
            SendUtil.sendMQ(rtuConfJson, Conf.ip_port,Conf.w2z_MQ);

            String result = search(rtuConfJson);
            return result;
        }catch (Exception e){
            log.info("发送cat配置请求到mq出错!!!");
            e.printStackTrace();
        }
        return "";
    }


    @RequestMapping(value = "/getDeviceInfo",method = RequestMethod.GET)
    public Map<String,Object> getDeviceInfo(HttpServletRequest req){
        log.info("调用mq发送实时查询");
        try {
            String rtu_id = req.getParameter("rtu_id");
            RTU rtu = rtuService.selectRTUById(Integer.parseInt(rtu_id));
            String channo = req.getParameter("channo");
            String deviceId = req.getParameter("deviceId");
            String portId = req.getParameter("portId");
            int deviceType = Integer.parseInt(req.getParameter("deviceType"));
            if(deviceType == 0){
                //接触式地阻
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                //转换deviceId
                Map<String,Object> temp = new HashMap<>();
                temp.put("rtu_id",rtu_id);
                temp.put("rst_id",deviceId);
                temp.put("rtu_port",channo);
                List<ETCR> etcrList = etcrService.selectETCRByRTUIdAndRSTId(temp);
                if(etcrList != null && etcrList.size()>0){
                    StringBuilder str = new StringBuilder("000000000000");
                    for(int i=0;i<etcrList.size();i++){
                        ETCR tempEtcr = etcrList.get(i);
                        if(tempEtcr.getRelayno() == 1){
                            str.replace(3,4,"1");
                        }
                        if(tempEtcr.getRelayno() == 2) {
                            str.replace(2, 3, "1");
                        }
                        if(tempEtcr.getRelayno() == 3) {
                            str.replace(1, 2, "1");
                        }
                        if(tempEtcr.getRelayno() == 4) {
                            str.replace(0, 1, "1");
                        }

                    }
                    int rel = Integer.parseInt(str.toString(),2);
                    params.put("deviceId",rel+Integer.parseInt(deviceId));
                }
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的ETCR实时查询配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                Map<String,Class> classMap = new HashMap<>();
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Values v = d.getValues().get(0);
                String resultValue = v.getValue();
                Map<String,Object> resultMap = new HashMap<>();
                //修正start
                Map<String,Object> etcrParam = new HashMap<>();
                etcrParam.put("rtu_id",rtu_id);
                etcrParam.put("rtu_port",channo);
                etcrParam.put("rst_id",deviceId);
                etcrParam.put("relayno",portId);
                ETCR etcr = confService.selectEtcrConf(etcrParam);
                if(Integer.parseInt(portId) != 0){
                    Double valueNew = Double.parseDouble(resultValue) - 0.0175 * Double.parseDouble(etcr.getRst_line_long())/Double.parseDouble(etcr.getRst_line_radius());
                    resultMap.put("resultValue",valueNew+"");
                }else{
                    //继电器为零，不修正
                    resultMap.put("resultValue",resultValue);
                }
                //修正end
                return resultMap;
            }else if(deviceType == 1){
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                params.put("deviceId",deviceId);
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的ETCRB配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                Map<String,Class> classMap = new HashMap<>();
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Values v = d.getValues().get(0);
                String resultValue = v.getValue();
                Map<String,Object> resultMap = new HashMap<>();

                //修正start
                Map<String,Object> etcrBParam = new HashMap<>();
                etcrBParam.put("rtu_id",rtu_id);
                etcrBParam.put("rtu_port",channo);
                etcrBParam.put("rst_id",deviceId);
                etcrBParam.put("relayno",portId);
                ETCR etcr = confService.selectEtcrConf(etcrBParam);
                if(etcr.getR1() != 0 && etcr.getRc() != 0){
                    Double valueNew = Double.parseDouble(resultValue) * Double.parseDouble(etcr.getR1()+"")/(Double.parseDouble(etcr.getR1()+"")+ Double.parseDouble(etcr.getRc()+""));
                    resultMap.put("resultValue",valueNew+"");
                }else{
                    resultMap.put("resultValue",resultValue);
                }
                //修正end
                return resultMap;
            }else if(deviceType == 4){
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                params.put("deviceId",deviceId);
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的Static配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                Map<String,Class> classMap = new HashMap<>();
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Values v = d.getValues().get(0);
                String resultValue = v.getValue();
                Map<String,Object> resultMap = new HashMap<>();

                //修正start
                Map<String,Object> staticParam = new HashMap<>();
                staticParam.put("rtu_id",rtu_id);
                staticParam.put("rtu_port",channo);
                staticParam.put("staet_id",deviceId);
                Static Static = confService.selectStaticConf(staticParam);
                if(Static.getStaet_v0() != null && Static.getStaet_v0() != "" && Static.getStaet_k() != null && Static.getStaet_k() != "" && Integer.parseInt(Static.getStaet_k()) != 0){
                    Double valueNew = (Double.parseDouble(resultValue) - Double.parseDouble(Static.getStaet_v0()))/Double.parseDouble(Static.getStaet_k());
                    resultMap.put("resultValue",valueNew+"");
                }

                //修正end

                return resultMap;
            }else if(deviceType == 7){
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                params.put("deviceId",deviceId);
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的Stray配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                Map<String,Class> classMap = new HashMap<>();
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Map<String,Object> resultMap = new HashMap<>();

                List<Values> valuesLists = d.getValues();
                List<String> finalValuesList = new LinkedList<>();
                for(int i=0;i<valuesLists.size();i++){
                    Values v = valuesLists.get(i);

                    String resultValue = v.getValue();
                    //修正start
                    Map<String,Object> strayParam = new HashMap<>();
                    strayParam.put("rtu_id",rtu_id);
                    strayParam.put("rtu_port",channo);
                    strayParam.put("stret_id",deviceId);
                    strayParam.put("portId",i+1);
                    Stray stray = confService.selectStrayConf(strayParam);
                    if(stray.getComputeType() == 1){
                        //1型
                        if(stray.getCalvalue() != null && stray.getCalvalue() != "" && stray.getFactor() != null && stray.getFactor() != "" && stray.getFullscale() != null && stray.getFullscale() != ""){
                            Double valueNew = (((Double.parseDouble(resultValue)+ Double.parseDouble(stray.getCalvalue()))/Double.parseDouble(stray.getFactor()))-4)*(Double.parseDouble(stray.getFullscale())/16)-(Double.parseDouble(stray.getFullscale())/2);
                            finalValuesList.add(valueNew+"");
                        }else{
                            finalValuesList.add(resultValue);
                        }
                    }else{
                        //2型
                        if(stray.getCalvalue() != null && stray.getCalvalue() != "" && stray.getFactor() != null && stray.getFactor() != "" && stray.getFullscale() != null && stray.getFullscale() != ""){
                            Double valueNew = ((Double.parseDouble(resultValue)+ Double.parseDouble(stray.getCalvalue()))/Double.parseDouble(stray.getFactor())-4)*(Double.parseDouble(stray.getFullscale())/16);
                            finalValuesList.add(valueNew+"");
                        }else{
                            finalValuesList.add(resultValue);
                        }
                    }
                    //修正end
                }
                resultMap.put("resultValue",finalValuesList);
                return resultMap;
            }else if(deviceType == 8){
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                params.put("deviceId",deviceId);
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的Cat配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                Map<String,Class> classMap = new HashMap<>();
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Values v = d.getValues().get(0);
                String resultValue = v.getValue();
                Map<String,Object> resultMap = new HashMap<>();

                //修正start
                Map<String,Object> catParam = new HashMap<>();
                catParam.put("rtu_id",rtu_id);
                catParam.put("rtu_port",channo);
                catParam.put("cathode_id",deviceId);
                Cat cat = confService.selectCatConf(catParam);
                if(cat.getCalvalue() != null && cat.getCalvalue() != "" && cat.getFactor() != null && cat.getFactor() != "" && cat.getFullscale() != null && cat.getFullscale() != ""){
                    Double valueNew =  (((Double.parseDouble(resultValue)+ Double.parseDouble(cat.getCalvalue()))/Double.parseDouble(cat.getFactor()))-4)*(Double.parseDouble(cat.getFullscale())/16)-(Double.parseDouble(cat.getFullscale())/2);
                    resultMap.put("resultValue",valueNew+"");
                }else{
                    resultMap.put("resultValue",resultValue);
                }
                //修正end

                return resultMap;
            }else{
                Map<String,Object> params = new HashMap<>();
                params.put("channo",channo);
                params.put("deviceId",deviceId);
                JSONObject getDeviceJson = TestGetDeviceInfo.getDeviceInfo(rtu,params);
                log.info(" 发送到底端的 "+deviceType+" 配置为 ： "+getDeviceJson);
                SendUtil.sendMQ(getDeviceJson,Conf.ip_port,Conf.w2z_MQ);

                String result = searchValue(getDeviceJson);
                if("请求超时".equals(result)){
                    Map<String,Object> resultMap = new HashMap<>();
                    resultMap.put("resultValue","查询失败");
                    return resultMap;
                }
                Map<String,Class> classMap = new HashMap<>();
                classMap.put("values", Values.class);
                DBInfo d = (DBInfo) JSONObject.toBean(JSONObject.fromObject(result),DBInfo.class,classMap);
                log.info(" DBInfo ： "+d);
                Values v = d.getValues().get(0);
                String resultValue = v.getValue();
                Map<String,Object> resultMap = new HashMap<>();

                if(deviceType == 3){//温湿度
                    List<String> tlist = new LinkedList<>();
                    tlist.add(d.getValues().get(0).getValue());
                    tlist.add(d.getValues().get(1).getValue());
                    resultMap.put("resultValue",tlist);
                    return resultMap;
                }else if(deviceType == 5){//倾斜度
                    List<String> tlist = new LinkedList<>();
                    tlist.add(d.getValues().get(0).getValue());
                    tlist.add(d.getValues().get(1).getValue());
                    resultMap.put("resultValue",tlist);
                    return resultMap;
                }else if(deviceType == 6){//电气安全
                    List<String> tlist = new LinkedList<>();
                    tlist.add(d.getValues().get(0).getValue());
                    tlist.add(d.getValues().get(1).getValue());
                    tlist.add(d.getValues().get(2).getValue());
                    tlist.add(d.getValues().get(3).getValue());
                    resultMap.put("resultValue",tlist);
                    return resultMap;
                }
                resultMap.put("resultValue",resultValue);
                return resultMap;
            }
        }catch (Exception e){
            log.info("获取设备信息失败！！！");
            e.printStackTrace();
        }
        return null;
    }

    public String searchValue(JSONObject getDeviceJson){
        String serialNumber = getDeviceJson.get("callId")+"";
        Date a = new Date();
        try{
            while(true){
                for (String key : map.keySet()) {
                    if(serialNumber.equals(key)){
                        JSONObject jsonObject = map.get(serialNumber);
                        SendController.removeMap(serialNumber);
                        log.info("已查询到该条消息 ： "+jsonObject);
                        String str = jsonObject.get("respResult")+"";
                        if(Integer.parseInt(str) == 2){
                            log.info("已查询到该条DBInfo");
                            return jsonObject.get("DBInfo")+"";
                        }
                    }
                }
                Date b = new Date();
                if((b.getTime() - a.getTime()) > 60000){
                    return "请求超时";
                }
                Thread.sleep(500);
            }
        }catch (Exception e){
            log.error(e.toString());
            return e.toString();
        }
    }

    public static void main(String[] args) {
        Date a = new Date();
        try {
            Thread.sleep(2000);
            Date b = new Date();
            //log.info((b.getTime()-a.getTime())+"");
        }catch (Exception e){
            e.printStackTrace();
        }

    }


    public String search(JSONObject rtuConfJson){
        log.info("已进入扫描函数！！！");
        try {
            Map<String,Class> classMap = new HashMap<>();
            classMap.put("RS485InfoList", RS485Info.class);
            classMap.put("DAInfoList", DAInfo.class);
            classMap.put("userInfo", USERInfo.class);
            RTUConfig r = (RTUConfig) JSONObject.toBean(rtuConfJson,RTUConfig.class,classMap);
            String serialNumber = r.getCallId();
            Date a = new Date();
            while(true){
                if(map != null && map.size()>0){
                    for (String key : map.keySet()) {
                        if(serialNumber.equals(key)){
                            JSONObject jsonObject = map.get(serialNumber);
                            SendController.removeMap(serialNumber);
                            log.info("已查询到该条消息 ： "+jsonObject);
                            String temp = jsonObject.get("respResult").toString();
                            int RespResult = Integer.parseInt(temp);
                            if(RespResult == 1){
                                log.info("流水号为 ： "+serialNumber+" 的该条信息返回成功");
                                return "配置成功";
                            }else if(RespResult == 0) {
                                log.info("流水号为 ： "+serialNumber+" 的该条信息发送设备无响应");
                                return "设备无响应";
                            }else if(RespResult == 3) {
                                log.info("流水号为 ： "+serialNumber+" 的该条信息请求格式错误");
                                return "请求格式错误";
                            }

                        }
                    }
                }
                Date b = new Date();
                if((b.getTime() - a.getTime()) > 30000){
                    return "请求超时";
                }
                Thread.sleep(500);
            }
        }catch (Exception e){
            log.error(e.toString());
            return e.toString();
        }
    }
}
