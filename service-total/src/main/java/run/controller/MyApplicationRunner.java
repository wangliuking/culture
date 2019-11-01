package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import run.service.TotalService;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

/**
 * 开机启动类及定时任务
 */
@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Autowired
    private TotalService totalService;

    @Override
    public void run(ApplicationArguments var1) throws Exception{
        System.out.println("MyApplicationRunner class will be execute when the project was started!");
        scheduledInit();
    }

    public void scheduledInit() {
        LinkedList<Map<String,Object>> nowDataList = new LinkedList<>();
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
        Date d = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH");
        SimpleDateFormat sdf1 = new SimpleDateFormat("HH");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        String nowTime = sdf.format(d);
        String hour = sdf1.format(d);
        String day = sdf2.format(d);
        System.out.println("当前时间：" + nowTime);
        System.out.println("hour：" + hour);
        System.out.println("day：" + day);
        System.out.println("startTime：" + nowTime+":00:00");
        System.out.println("endTime：" + nowTime+":59:59");
        for(int i = Integer.parseInt(hour)-1;i>-1;i--){
            String time = "";
            String str = "";
            if(i<10){
                time = day + " 0"+i;
                str = "0"+i;
            }else{
                time = day + " "+i;
                str = i+"";
            }
            Map<String,Object> param = new HashMap<>();
            param.put("startTime",time+":00:00");
            param.put("endTime",time+":59:59");
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
            for(int j=0;j<nowDataList.size();j++){
                Map<String,Object> temp = nowDataList.get(j);
                String label = temp.get("label")+"";
                if(str.equals(label)){
                    Map<String,Object> params = new HashMap<>();
                    params.put("label",label);
                    params.put("num",total);
                    nowDataList.set(j,params);
                }
            }
        }

        System.out.println("nowDataList :"+nowDataList);
        ScheduledService.setNowDataList(nowDataList);
    }

}
