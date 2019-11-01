package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendSvtConf")
    @Headers("Content-Type: application/json")
    public String sendSvtConf(Map<String, Object> map);

    @RequestLine("POST /sendSvtConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendSvtConfForRTU(Map<String, Object> map);

}
