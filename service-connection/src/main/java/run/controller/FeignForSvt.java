package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-svt",configuration= FeignConf.class)
public interface FeignForSvt {
    @RequestLine("GET /deleteSvt?rtu_id={rtu_id}&tilt_id={tilt_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteSvt(@Param("rtu_id") String rtu_id, @Param("tilt_id") String tilt_id, @Param("rtu_port") String rtu_port);

}
