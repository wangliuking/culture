package com.wlk.feign;

import feign.Contract;
import feign.auth.BasicAuthRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfAuth {
    @Bean
    public Contract useFeignAnnotations() {
        return new Contract.Default();
    }
    //为FeignConfiguration添加链接eureka的权限
    @Bean
    public BasicAuthRequestInterceptor basicAuthRequestInterceptor() {
        return new BasicAuthRequestInterceptor("test", "test");
    }
}
