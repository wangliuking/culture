package com.wlk.feign;

import com.wlk.bean.Site;
import feign.Headers;
import feign.Param;
import feign.RequestLine;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@FeignClient(name="service-connection",configuration= FeignConfConnect.class)
public interface FeignForConnect {
    @RequestLine("GET /selectAllSite?start={start}&limit={limit}" +
            "&site_name={site_name}&site_industry={site_industry}" +
            "&site_province={site_province}&site_city={site_city}" +
            "&site_county={site_county}&site_company={site_company}&status={status}")
    @Headers("Content-Type: application/json")
    public Map<String,Object> selectAllSite(@Param("start") int start,
                                            @Param("limit") int limit,
                                            @Param("site_name") String site_name,
                                            @Param("site_industry") String site_industry,
                                            @Param("site_province") String site_province,
                                            @Param("site_city") String site_city,
                                            @Param("site_county") String site_county,
                                            @Param("site_company") String site_company,
                                            @Param("status") String status);

    @RequestLine("GET /selectSiteById")
    public Map<String,Object> selectSiteById();

    @RequestLine("POST /insertSite")
    @Headers("Content-Type: application/json")
    public Map<String,Object> insertSite(Site site);

    @RequestLine("GET /deleteSite?id={id}")
    public Map<String,Object> deleteSite(@Param("id") String id);

    @RequestLine("POST /updateSite")
    @Headers("Content-Type: application/json")
    public Map<String,Object> updateSite(Site site);


}
