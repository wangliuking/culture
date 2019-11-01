package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.bean.SPD;
import run.bean.Site;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
public interface FeignForMQ {

    @RequestLine("POST /sendRTUConf")
    @Headers("Content-Type: application/json")
    public void sendRTUConf(RTU rtu);

    @RequestLine("POST /sendSPDConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendSPDConfForRTU(Map<String,Object> map);

    @RequestLine("POST /sendSPDConf")
    @Headers("Content-Type: application/json")
    public void sendSPDConf(Map<String,Object> map);

    @RequestLine("POST /getDeviceInfo")
    @Headers("Content-Type: application/json")
    public void getDeviceInfo(Map<String,Object> map);

}
