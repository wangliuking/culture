package run.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import run.service.WeChatService;

import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class ScheduledService {
    @Autowired
    private WeChatController weChatController;
    @Autowired
    private WeChatService weChatService;

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
    public void scheduled(){

    }
}
