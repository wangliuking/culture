package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

import java.util.List;
import java.util.Map;

@FeignClient(name="wechat",configuration= FeignConf.class)
public interface FeignForWeChat {

    @RequestLine("GET /getUserList")
    @Headers("Content-Type: application/json")
    Map<String,Object> getUserList();

    @RequestLine("GET /dayClickNum")
    @Headers("Content-Type: application/json")
    Map<String,Object> dayClickNum();

}
