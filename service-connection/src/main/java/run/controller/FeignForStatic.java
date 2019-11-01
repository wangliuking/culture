package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-static",configuration= FeignConf.class)
public interface FeignForStatic {
    @RequestLine("GET /deleteStatic?rtu_id={rtu_id}&staet_id={staet_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteStatic(@Param("rtu_id") String rtu_id, @Param("staet_id") String staet_id, @Param("rtu_port") String rtu_port);

}
