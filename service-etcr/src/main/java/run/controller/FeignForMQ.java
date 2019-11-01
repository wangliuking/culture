package run.controller;

import feign.Headers;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.bean.RTU;
import run.feign.FeignConfMQ;

import java.util.Map;

@FeignClient(name="service-MQ",configuration= FeignConfMQ.class)
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

    @RequestLine("POST /sendETCRBConf")
    @Headers("Content-Type: application/json")
    public void sendETCRBConf(Map<String, Object> map);

    @RequestLine("POST /getDeviceInfo")
    @Headers("Content-Type: application/json")
    public void getDeviceInfo(Map<String, Object> map);

    @RequestLine("POST /sendETCRConfForRTU")
    @Headers("Content-Type: application/json")
    public String sendETCRConfForRTU(Map<String, Object> map);

}
