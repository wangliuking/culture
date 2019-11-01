package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConf;

import java.util.List;
import java.util.Map;

@FeignClient(name="service-connection",configuration= FeignConf.class)
public interface FeignForStructure {

    @RequestLine("GET /foreachIdAndPId?id={id}")
    @Headers("Content-Type: application/json")
    public List<Integer> foreachIdAndPId(@Param("id") String id);

}
