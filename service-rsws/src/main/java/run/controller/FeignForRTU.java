package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConfMQ;

@FeignClient(name="service-connection",configuration= FeignConfMQ.class)
public interface FeignForRTU {

    @RequestLine("GET /selectRTUById?id={id}")
    @Headers("Content-Type: application/json")
    public RTU selectRTUById(@Param("id") int id);


}
