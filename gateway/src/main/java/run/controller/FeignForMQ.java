package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConfMQ;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {

    @RequestLine("GET /checkcenter/socket/pushForLogin/{cid}")
    @Headers("Content-Type: application/json")
    public String pushToWebForLogin(@Param("cid") String cid);

}
