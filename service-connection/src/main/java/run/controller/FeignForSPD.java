package run.controller;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import run.feign.FeignConf;

@FeignClient(name="service-spd",configuration= FeignConf.class,fallback = FeignForSPDFailure.class)
public interface FeignForSPD {
    @RequestLine("GET /deleteSPD?rtu_id={rtu_id}&spd_number={spd_number}&site_id={site_id}")
    @Headers("Content-Type: application/json")
    public Object deleteSPD(@Param("rtu_id") String rtu_id,@Param("spd_number") String spd_number,@Param("site_id") String site_id);

    @RequestLine("GET /deleteSPDBySite?site_id={site_id}")
    @Headers("Content-Type: application/json")
    public String deleteSPDBySite(@Param("site_id") String site_id);

    @RequestLine("GET /deleteSPDByRTU?rtu_id={rtu_id}")
    @Headers("Content-Type: application/json")
    public String deleteSPDByRTU(@Param("rtu_id") String rtu_id);

    @RequestLine("GET /selectSPDCountBySite?site_id={site_id}")
    @Headers("Content-Type: application/json")
    public int selectSPDCountBySite(@Param("site_id") int site_id);
}
