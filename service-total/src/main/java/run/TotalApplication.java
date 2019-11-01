package run;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import run.controller.ScheduledService;
import run.controller.TotalController;

@MapperScan("run.mapper")
@EnableEurekaClient
@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class TotalApplication {
    public static void main(String[] args) {
        SpringApplication.run(TotalApplication.class, args);
    }
}
