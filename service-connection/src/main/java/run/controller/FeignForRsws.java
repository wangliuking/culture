package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-rsws",configuration= FeignConf.class)
public interface FeignForRsws {
    @RequestLine("GET /deleteRsws?rtu_id={rtu_id}&hmt_id={hmt_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteRsws(@Param("rtu_id") String rtu_id, @Param("hmt_id") String hmt_id, @Param("rtu_port") String rtu_port);

}
