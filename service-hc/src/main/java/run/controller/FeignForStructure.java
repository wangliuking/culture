package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

import java.util.List;

@FeignClient(name="service-connection",configuration= FeignConf.class)
public interface FeignForStructure {

    @RequestLine("GET /foreachIdAndPId?id={id}")
    @Headers("Content-Type: application/json")
    public List<Integer> foreachIdAndPId(@Param("id") String id);

}
