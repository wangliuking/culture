package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-cat",configuration= FeignConf.class)
public interface FeignForCat {
    @RequestLine("GET /deleteCat?rtu_id={rtu_id}&cathode_id={cathode_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteCat(@Param("rtu_id") String rtu_id, @Param("cathode_id") String cathode_id, @Param("rtu_port") String rtu_port);

}
