package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="gateway",configuration= FeignConfMQ.class)
public interface FeignForLog {

    @RequestLine("GET /insertLog?type={type}&content={content}")
    @Headers("Content-Type: application/json")
    public void insertLog(@Param("type") String type,@Param("content") String content);

}
