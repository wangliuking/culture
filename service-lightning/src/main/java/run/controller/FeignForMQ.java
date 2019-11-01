package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendLightningConf")
    @Headers("Content-Type: application/json")
    public String sendLightningConf(Map<String, Object> map);

    @RequestLine("POST /sendLightningConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendLightningConfForRTU(Map<String, Object> map);

}
