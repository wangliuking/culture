package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendCatConf")
    @Headers("Content-Type: application/json")
    public String sendCatConf(Map<String, Object> map);

    @RequestLine("POST /sendCatConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendCatConfForRTU(Map<String, Object> map);

}
