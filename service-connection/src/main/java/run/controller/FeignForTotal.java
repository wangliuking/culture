package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConf;

import java.util.Map;

@FeignClient(name="service-total",configuration= FeignConf.class)
public interface FeignForTotal {

    @RequestLine("GET /selectForFeignMQ?site_id={site_id}&structure={structure}")
    @Headers("Content-Type: application/json")
    public Map<String,Object> selectForFeignMQ(@Param("site_id") String site_id,@Param("structure") String structure);

}
