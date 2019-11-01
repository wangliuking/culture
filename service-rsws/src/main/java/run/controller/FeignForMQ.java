package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {


    @RequestLine("POST /sendRswsConf")
    @Headers("Content-Type: application/json")
    public String sendRswsConf(Map<String, Object> map);

    @RequestLine("POST /sendRswsConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendRswsConfForRTU(Map<String, Object> map);

}
