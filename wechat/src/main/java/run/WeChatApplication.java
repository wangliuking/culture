package run;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@MapperScan("run.mapper")
@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class WeChatApplication {
    public static void main(String[] args) {
        SpringApplication.run(WeChatApplication.class, args);
    }
}
