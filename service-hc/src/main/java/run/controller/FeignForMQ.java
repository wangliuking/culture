package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendHcConf")
    @Headers("Content-Type: application/json")
    public String sendHcConf(Map<String, Object> map);

    @RequestLine("POST /sendHcConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendHcConfForRTU(Map<String, Object> map);

}
