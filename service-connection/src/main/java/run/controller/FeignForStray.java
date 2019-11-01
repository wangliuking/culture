package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-stray",configuration= FeignConf.class)
public interface FeignForStray {
    @RequestLine("GET /deleteStray?rtu_id={rtu_id}&stret_id={stret_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteStray(@Param("rtu_id") String rtu_id, @Param("stret_id") String stret_id, @Param("rtu_port") String rtu_port);

}
