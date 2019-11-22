package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.scheduling.annotation.Async;
import run.feign.FeignConf;

@FeignClient(name="service-MQ",configuration= FeignConf.class)
public interface FeignForMQ {

    @Async
    @RequestLine("GET /checkcenter/socket/broadcast")
    @Headers("Content-Type: application/json")
    String broadcast();

}
