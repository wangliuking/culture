package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-lightning",configuration= FeignConf.class)
public interface FeignForLightning {
    @RequestLine("GET /deleteLightning?rtu_id={rtu_id}&ltn_id={ltn_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteLightning(@Param("rtu_id") String rtu_id, @Param("ltn_id") String ltn_id, @Param("rtu_port") String rtu_port);

}
