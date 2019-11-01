package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-hc",configuration= FeignConf.class)
public interface FeignForHc {
    @RequestLine("GET /deleteHc?rtu_id={rtu_id}&es_id={es_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteHc(@Param("rtu_id") String rtu_id, @Param("es_id") String es_id, @Param("rtu_port") String rtu_port);

}
