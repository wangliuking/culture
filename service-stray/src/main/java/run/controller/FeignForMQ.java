package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendStrayConf")
    @Headers("Content-Type: application/json")
    public String sendStrayConf(Map<String, Object> map);

    @RequestLine("POST /sendStrayConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendStrayConfForRTU(Map<String, Object> map);

}
