package com.wlk.feign;

import feign.Contract;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfiguration {
    //使用feign的注解方式
    @Bean
    public Contract useFeignAnnotations() {
        return new Contract.Default();
    }


}
