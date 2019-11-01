package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendStaticConf")
    @Headers("Content-Type: application/json")
    public String sendStaticConf(Map<String, Object> map);

    @RequestLine("POST /sendStaticConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendStaticConfForRTU(Map<String, Object> map);

}
