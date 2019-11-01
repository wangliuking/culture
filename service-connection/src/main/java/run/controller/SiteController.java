package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import run.bean.RTU;
import run.bean.Site;
import run.service.RTUService;
import run.service.SiteService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@SuppressWarnings("all")
@RestController
public class SiteController {
    @Autowired
    private SiteService siteService;
    @Autowired
    private RTUService rtuService;
    @Autowired
    private FeignForSPD feignForSPD;
    @Autowired
    private FeignForETCR feignForETCR;
    @Autowired
    private FeignForTotal feignForTotal;
    @Autowired
    private StructureController structureController;

    //确认是否登录
    @RequestMapping("/ensure")
    public Map<String,Object> ensure() {
        Map<String,Object> resultMap = new HashMap<>();
        return resultMap;
    }

    @RequestMapping(value = "/selectAllSite",method = RequestMethod.GET)
    public Map<String,Object> selectAllSite (HttpServletRequest req, HttpServletResponse resp){
        int start;
        if(req.getParameter("start") != null && !"".equals(req.getParameter("start"))){
            start = Integer.parseInt(req.getParameter("start"));
        }else {
            start = -1;
        }
        int limit;
        if(req.getParameter("limit") != null && !"".equals(req.getParameter("limit"))){
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
        String structure = req.getParameter("structure");
        List<Integer> strList = structureController.foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("site_name",site_name);
        param.put("site_industry",site_industry);
        param.put("site_province",site_province);
        param.put("site_city",site_city);
        param.put("site_county",site_county);
        param.put("site_company",site_company);
        param.put("start",start);
        param.put("limit",limit);
        List<Map<String,Object>> siteList = siteService.selectAllSite(param);
        int siteListCount = siteService.selectAllSiteCount(param);

        Map<String,Object> siteListMap = new HashMap<>();
        siteListMap.put("items",siteList);
        siteListMap.put("totals",siteListCount);
        return siteListMap;
    }

    /*@RequestMapping(value = "/selectAllSite",method = RequestMethod.GET)
    public Map<String,Object> selectAllSite (HttpServletRequest req, HttpServletResponse resp){
        int start;
        if(req.getParameter("start") != null && !"".equals(req.getParameter("start"))){
            start = Integer.parseInt(req.getParameter("start"));
        }else {
            start = -1;
        }
        int limit;
        if(req.getParameter("limit") != null && !"".equals(req.getParameter("limit"))){
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
        String structure = req.getParameter("structure");
        List<Integer> strList = structureController.foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("site_name",site_name);
        param.put("site_industry",site_industry);
        param.put("site_province",site_province);
        param.put("site_city",site_city);
        param.put("site_county",site_county);
        param.put("site_company",site_company);
        param.put("start",start);
        param.put("limit",limit);
        List<Map<String,Object>> siteList = siteService.selectAllSite(param);
        Map<String,Object> siteListMap = new HashMap<>();
        if(start == -1 || limit == -1){
            siteListMap.put("items",siteList);
            siteListMap.put("totals",siteList.size());
            return siteListMap;
        }else{
            //遍历siteList集合
            if(siteList.size()>0){
                for(int i=0;i<siteList.size();i++){
                    Map<String,Object> map = siteList.get(i);
                    Map<String,Object> resultMap = feignForTotal.selectForFeignMQ(map.get("site_id")+"",structure);
                    System.out.println("resultMap : "+resultMap);
                    List<Integer> rtuStatusList = (List<Integer>)resultMap.get("rtuStatusList");
                    System.out.println("rtuStatusList : "+rtuStatusList);
                    int rtuNum = Integer.parseInt(resultMap.get("rtuNum")+"");
                    int rtuOffNum = Integer.parseInt(resultMap.get("rtuOffNum")+"");
                    int deviceWarningCount = Integer.parseInt(resultMap.get("deviceWarningCount")+"");
                    if(rtuNum == 0 || rtuOffNum > 0){
                        //离线
                        map.put("status",1);
                    }else if(rtuStatusList == null || rtuStatusList.size() == 0){
                        //离线
                        map.put("status",1);
                    }else if(deviceWarningCount > 0){
                        //异常
                        map.put("status",2);
                    }else{
                        //正常
                        map.put("status",0);
                    }
                    map.put("deviceNum",resultMap.get("deviceNum"));
                    map.put("rtuNum",rtuNum);
                }
            }

            if(status != null && !"".equals(status)){
                int temp = Integer.parseInt(status);
                List<Map<String,Object>> finalList = new LinkedList<>();
                int count = 0;
                for(int i=start;i<siteList.size();i++){
                    Map<String,Object> map = siteList.get(i);
                    if(count == limit){
                        break;
                    }
                    int s = Integer.parseInt(map.get("status")+"");
                    if(s == temp){
                        finalList.add(map);
                        count++;
                    }

                }
                int size = 0;
                for(int i=start;i<siteList.size();i++){
                    Map<String,Object> map = siteList.get(i);
                    int s = Integer.parseInt(map.get("status")+"");
                    if(s == temp){
                        size++;
                    }

                }
                siteListMap.put("items",finalList);
                siteListMap.put("totals",size);
                return siteListMap;
            }else{

                List<Map<String,Object>> finalList = new LinkedList<>();
                int count = 0;
                for(int i=start;i<siteList.size();i++){
                    Map<String,Object> map = siteList.get(i);
                    if(count == limit){
                        break;
                    }
                    finalList.add(map);
                    count++;

                }

                siteListMap.put("items",finalList);
                siteListMap.put("totals",siteList.size());
                return siteListMap;
            }
        }
    }*/

    @RequestMapping(value = "/selectSiteById", method = RequestMethod.GET)
    public String selectSiteById (@RequestParam int id){
        return siteService.selectSiteById(id).toString();
    }

    @RequestMapping(value = "/insertSite", method = RequestMethod.POST)
    public Map<String,Object> insertSite (@RequestBody Site site){

        int result = siteService.insertSite(site);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了站点");
        }else {
            map.put("success",false);
            map.put("message","添加站点失败");
        }
        return map;
    }

    @RequestMapping(value = "/deleteSite", method = RequestMethod.GET)
    public Map<String, Object> deleteSite(HttpServletRequest req, HttpServletResponse resp){
        System.out.println("准备删除该站点！！！");
        int id = Integer.parseInt(req.getParameter("id"));
        int res = siteService.deleteSite(id);
        rtuService.deleteRTUBySite(id);
        feignForSPD.deleteSPDBySite(id+"");
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了站点");
        }else {
            map.put("success",false);
            map.put("message","删除站点失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateSite", method = RequestMethod.POST)
    public Map<String, Object> updateSite(@RequestBody Site site,HttpServletRequest req){
        int result = siteService.updateSite(site);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了站点");
        }else {
            map.put("success",false);
            map.put("message","更新站点失败");
        }
        return map;
    }

    @RequestMapping(value = "/selectSiteStatisticBySiteId", method = RequestMethod.GET)
    public Object selectSiteStatisticBySiteId(HttpServletRequest req){
        String str = req.getParameter("site_id");
        Map<String,Object> map = new HashMap<>();
        int site_id = 0;
        if(str != null && !"".equals(str)){
            site_id = Integer.parseInt(str);
            Site site = siteService.selectSiteById(site_id);
            int rtuNum = rtuService.selectRTUCountBySiteId(site_id);
            int spdNum = feignForSPD.selectSPDCountBySite(site_id);
            int etcrNum = feignForETCR.selectETCRCountBySite(site_id);
            map.put("site",site);
            map.put("rtuNum",rtuNum);
            map.put("spdNum",spdNum);
            map.put("etcrNum",etcrNum);
        }
        return map;
    }
}
