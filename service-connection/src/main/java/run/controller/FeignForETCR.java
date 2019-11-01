package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-etcr",configuration= FeignConf.class,fallback = FeignForETCRFailure.class)
public interface FeignForETCR {
    @RequestLine("GET /deleteETCR?rtu_id={rtu_id}&rst_id={rst_id}&rtu_port={rtu_port}")
    @Headers("Content-Type: application/json")
    public Object deleteETCR(@Param("rtu_id") String rtu_id,@Param("rst_id") String rst_id,@Param("rtu_port") String rtu_port);

    @RequestLine("GET /selectETCRCountBySiteId?site_id={site_id}")
    @Headers("Content-Type: application/json")
    public int selectETCRCountBySite(@Param("site_id") int site_id);

}
