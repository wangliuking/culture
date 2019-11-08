package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import run.service.WeChatService;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 开机启动类及定时任务
 */
@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Autowired
    private WeChatService weChatService;

    @Override
    public void run(ApplicationArguments var1) throws Exception{
        System.out.println("MyApplicationRunner class will be execute when the project was started!");
        scheduledInit();
    }

    public void scheduledInit() {

    }

}
