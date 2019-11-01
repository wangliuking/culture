package run;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import protobuf.Z4WMQ;

@MapperScan("run.mapper")
@EnableEurekaClient
@SpringBootApplication
@EnableFeignClients
public class ServiceMQApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceMQApplication.class, args);
        try {
            /*MyThread myThread = new MyThread();
            myThread.start();*/
            Z4WMQ.alarmMQ();
        }catch (Exception e){
            e.printStackTrace();
        }

    }
}
