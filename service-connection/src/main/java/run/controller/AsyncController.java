package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import run.bean.RTU;
import run.service.RTUService;

import java.util.Map;

@SuppressWarnings("all")
@RestController
public class AsyncController {
    @Autowired
    FeignForMQ feignForMQ;
    @Autowired
    RTUService rtuService;

    public void asyncDelDeviceByRTUID(int rtu_id){
        rtuService.delSpd(rtu_id);
        rtuService.delEtcr(rtu_id);
        rtuService.delLightning(rtu_id);
        rtuService.delStatic(rtu_id);
        rtuService.delRsws(rtu_id);
        rtuService.delSvt(rtu_id);
        rtuService.delHc(rtu_id);
        rtuService.delStray(rtu_id);
        rtuService.delCat(rtu_id);
        rtuService.delAlarmNow(rtu_id);
        rtuService.delAlarmHistory(rtu_id);
    }

    public void asyncSendRtuDelNewConf (Map<String,Object> param){
        feignForMQ.sendRtuDelNewConf(param);
    }

    public void asyncSendRTUConf (RTU rtu){
        feignForMQ.sendRTUConf(rtu);
    }

    public void delRTUConfByRedis (String rtuId){
        Jedis jedis = new Jedis("localhost",6379);
        jedis.auth("XinHong12345");
        jedis.select(1);
        jedis.del(rtuId);
        jedis.close();
    }


}
