package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConf;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConf.class)
public interface FeignForMQ {

    @RequestLine("POST /sendRTUConf")
    @Headers("Content-Type: application/json")
    public void sendRTUConf(RTU rtu);

    @RequestLine("POST /sendSPDConf")
    @Headers("Content-Type: application/json")
    public void sendSPDConf(Map<String, Object> map);

    @RequestLine("POST /sendETCRConf")
    @Headers("Content-Type: application/json")
    public void sendETCRConf(Map<String, Object> map);

    @RequestLine("POST /getDeviceInfo")
    @Headers("Content-Type: application/json")
    public void getDeviceInfo(Map<String, Object> map);

    @RequestLine("POST /sendRtuDelNewConf")
    @Headers("Content-Type: application/json")
    public void sendRtuDelNewConf(Map<String, Object> map);

}
