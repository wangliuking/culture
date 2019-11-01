package run.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import run.service.TotalService;

import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class ScheduledService {
    @Autowired
    private TotalController totalController;
    @Autowired
    private TotalService totalService;

    private final Logger log = LoggerFactory.getLogger(ScheduledService.class);

    private static LinkedList<Map<String,Object>> nowDataList = new LinkedList<>();

    public static LinkedList<Map<String, Object>> getNowDataList() {
        return nowDataList;
    }

    public static void setNowDataList(LinkedList<Map<String, Object>> nowDataList) {
        ScheduledService.nowDataList = nowDataList;
    }

    public static void main(String[] args) {
        /*Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
        SimpleDateFormat sdf1 = new SimpleDateFormat("HH");
        String nowTime = sdf.format(d.getTime() - 3600 * 1000);
        String hour = sdf1.format(d);
        log.info("当前时间：" + nowTime);
        log.info("hour：" + hour);
        log.info("startTime：" + nowTime+":00:00");
        log.info("endTime：" + nowTime+":59:59");*/
    }

    @Scheduled(cron = "0/30 * * * * ?")
    @Async
    public void scheduledForSite(){
        List<Map<String,Object>> siteList = totalService.selectSite();
        log.info("siteList 为 ："+siteList);
        //遍历siteList集合
        if(siteList.size()>0){
            for(int i=0;i<siteList.size();i++){
                Map<String,Object> map = siteList.get(i);
                Map<String,Object> param = new HashMap<>();
                param.put("site_id",map.get("site_id")+"");

                int deviceWarningCount = totalService.selectDeviceWarningCountSchedule(param);
                int rtuNum = totalService.selectRTUNumBySiteIdCountSchedule(param);
                int rtuOffNum = totalService.selectRTUOffCountSchedule(param);
                int rtuWarningNum = totalService.selectRTUWarningCountSchedule(param);
                int spdNum = totalService.selectSPDCountSchedule(param);
                int etcrNum = totalService.selectETCRCountSchedule(param);
                int lightningNum = totalService.selectLightningCountSchedule(param);
                int staticNum = totalService.selectStaticCountSchedule(param);
                int rswsNum = totalService.selectRswsCountSchedule(param);
                int svtNum = totalService.selectSvtCountSchedule(param);
                int hcNum = totalService.selectHcCountSchedule(param);
                int strayNum = totalService.selectStrayCountSchedule(param);
                int catNum = totalService.selectCatCountSchedule(param);
                List<Integer> rtuStatusList = totalService.selectRTUStatusBySiteId(param);
                Map<String,Object> resultMap = new HashMap<>();
                resultMap.put("rtuStatusList",rtuStatusList);
                resultMap.put("deviceWarningCount",deviceWarningCount);
                resultMap.put("rtuNum",rtuNum);
                resultMap.put("rtuOffNum",rtuOffNum);
                resultMap.put("rtuWarningNum",rtuWarningNum);
                resultMap.put("deviceNum",spdNum+etcrNum+lightningNum+staticNum+rswsNum+svtNum+hcNum+strayNum+catNum);

                log.info("resultMap : "+resultMap);

                if(rtuNum == 0 || rtuOffNum > 0 || rtuStatusList == null || rtuStatusList.size() == 0){
                    //离线
                    map.put("status",1);
                }else if(deviceWarningCount > 0){
                    //异常
                    map.put("status",2);
                }else{
                    //正常
                    map.put("status",0);
                }
                map.put("deviceNum",resultMap.get("deviceNum"));
                map.put("rtuNum",rtuNum);

            }

            log.info("遍历后的siteList 为 ："+siteList);

            Map<String,Object> updateMap = new HashMap<>();
            updateMap.put("siteList",siteList);
            totalService.replaceSiteNowData(updateMap);
        }

    }

    @Scheduled(cron = "0 0/30 * * * ?")
    @Async
    public void scheduled() {
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
        SimpleDateFormat sdf1 = new SimpleDateFormat("HH");
        String nowTime = sdf.format(d.getTime() - 3600 * 1000);
        String hour = sdf1.format(d);
        log.info("当前时间：" + nowTime);
        log.info("startTime：" + nowTime+":00:00");
        log.info("endTime：" + nowTime+":59:59");

        Map<String,Object> param = new HashMap<>();
        param.put("startTime",nowTime+":00:00");
        param.put("endTime",nowTime+":59:59");
        int spdNum = totalService.selectSPDCountByTime(param);
        int etcrNum = totalService.selectETCRCountByTime(param);
        int lightningNum = totalService.selectLightningCountByTime(param);
        int staticNum = totalService.selectStaticCountByTime(param);
        int rswsNum = totalService.selectRswsCountByTime(param);
        int svtNum = totalService.selectSvtCountByTime(param);
        int hcNum = totalService.selectHcCountByTime(param);
        int strayNum = totalService.selectStrayCountByTime(param);
        int catNum = totalService.selectCatCountByTime(param);
        int total = spdNum+etcrNum+lightningNum+staticNum+rswsNum+svtNum+hcNum+strayNum+catNum;
        for(int i=0;i<nowDataList.size();i++){
            Map<String,Object> temp = nowDataList.get(i);
            String label = temp.get("label")+"";
            String result;
            int tempHour = Integer.parseInt(hour)-1;
            if(tempHour < 10){
                result = "0" + tempHour;
            }else {
                result = "" + tempHour;
            }
            if(result.equals(label)){
                Map<String,Object> params = new HashMap<>();
                params.put("label",label);
                params.put("num",total);
                nowDataList.set(i,params);
            }
        }
    }

    /**
     * 0点执行清空任务
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Async
    public void scheduledDel(){
        if(nowDataList != null){
            nowDataList.clear();
        }
        for(int i=0;i<25;i++){
            String label = "";
            if(i<10){
                label = "0" + i;
            }else{
                label = i + "";
            }
            Map<String,Object> params = new HashMap<>();
            params.put("label",label);
            params.put("num","");
            nowDataList.add(params);
        }
    }

    //雷电流告警采集(待定)
    /*@Scheduled(cron = "0 0/20 * * * ?")
    @Async
    public void scheduledForLightningAlarm() {

    }*/
}
