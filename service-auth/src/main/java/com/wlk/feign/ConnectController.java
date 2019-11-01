package com.wlk.feign;

import com.wlk.bean.Site;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ConnectController {
    @Autowired
    FeignForConnect feignForConnect;

    @RequestMapping(value = "/selectAllSite",method = RequestMethod.GET)
    public Map<String,Object> selectAllSite(HttpServletRequest req){
        int start;
        if(req.getParameter("start") != null){
            start = Integer.parseInt(req.getParameter("start"));
        }else {
            start = -1;
        }
        int limit;
        if(req.getParameter("limit") != null){
            limit = Integer.parseInt(req.getParameter("limit"));
        }else {
            limit = -1;
        }
        String site_name = req.getParameter("site_name");
        String site_industry = req.getParameter("site_industry");
        String site_province = req.getParameter("site_province");
        String site_city = req.getParameter("site_city");
        String site_county = req.getParameter("site_county");
        String site_company = req.getParameter("site_company");
        String status = req.getParameter("status");
        return feignForConnect.selectAllSite(start,limit,site_name,site_industry,site_province,site_city,site_county,site_company,status);
    }

    @RequestMapping(value = "/insertSite",method = RequestMethod.GET)
    public Map<String,Object> insertSite(HttpServletRequest req){
        String str = req.getParameter("str");
        JSONObject jsonObject = JSONObject.fromObject(str);
        Site site = (Site)JSONObject.toBean(jsonObject,Site.class);
        return feignForConnect.insertSite(site);
    }

    @RequestMapping(value = "/deleteSite",method = RequestMethod.GET)
    public Map<String,Object> deleteSite(HttpServletRequest req){
        String id = req.getParameter("id");
        return feignForConnect.deleteSite(id);
    }

    @RequestMapping(value = "/updateSite",method = RequestMethod.GET)
    public Map<String,Object> updateSite(HttpServletRequest req){
        String str = req.getParameter("str");
        JSONObject jsonObject = JSONObject.fromObject(str);
        Site site = (Site)JSONObject.toBean(jsonObject,Site.class);
        return feignForConnect.updateSite(site);
    }




}
