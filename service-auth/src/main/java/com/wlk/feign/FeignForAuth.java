package com.wlk.feign;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;

import java.util.List;

@FeignClient(name="authService",configuration= FeignConfAuth.class)
public interface FeignForAuth {

    @RequestLine("GET /hello")
    @Headers("Content-Type: application/json")
    public String hello();

    @RequestLine("GET /secure?access_token={access_token}")
    @Headers("Content-Type: application/json")
    public List<String> secure(@Param("access_token") String access_token);

    @RequestLine("POST /oauth/token?grant_type=password&username={username}&password={password}")
    @Headers("Content-Type: application/json")
    public String authToken(@Param("username") String username, @Param("password") String password, @Param("grant_type") String grant_type);

    @RequestLine("POST /oauth/logout")
    @Headers("Content-Type: application/json")
    public String logout();
}
