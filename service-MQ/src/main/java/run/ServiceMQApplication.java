package run;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;

@MapperScan("run.mapper")
@EnableEurekaClient
@SpringBootApplication
@EnableFeignClients
public class ServiceMQApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceMQApplication.class, args);
    }
}
