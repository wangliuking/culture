package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.RTU;
import run.service.LightningService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import run.bean.Lightning;
import run.util.ExcelUtil;

@RestController
public class LightningController {
    @Autowired
    private LightningService lightningService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllLightning",method = RequestMethod.GET)
    public Map<String,Object> selectAllLightning (HttpServletRequest req, HttpServletResponse resp){
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
        int site_id;
        if(req.getParameter("site_id") != null && req.getParameter("site_id") != ""){
            site_id = Integer.parseInt(req.getParameter("site_id"));
        }else {
            site_id = -1;
        }
        int rtu_id;
        if(req.getParameter("rtu_id") != null && req.getParameter("rtu_id") != ""){
            rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        }else {
            rtu_id = -1;
        }
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("start",start);
        param.put("limit",limit);
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);

        System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id);
        List<Map<String,Object>> LightningList = lightningService.selectAllLightning(param);
        int count = lightningService.selectAllLightningCount(param);
        Map<String,Object> LightningListMap = new HashMap<>();
        LightningListMap.put("items",LightningList);
        LightningListMap.put("totals",count);
        return LightningListMap;

    }

    @RequestMapping(value = "/insertLightning", method = RequestMethod.POST)
    public Map<String, Object> insertLightning (@RequestBody Lightning lightning){
        System.out.println("进入添加方法！！！");
        RTU rtu = feignForRTU.selectRTUById(lightning.getRtu_id());
        System.out.println(lightning);

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("lightning",lightning);
        tempParams.put("op",0);
        //feignForMQ.sendLightningConfForRTU(tempParams);
        //feignForMQ.sendLightningConf(tempParams);
        String res = feignForMQ.sendLightningConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            lightningService.insertLightning(lightning);

            Map<String,Object> params = new HashMap<>();
            params.put("rtu",rtu);
            params.put("lightning",lightning);
            params.put("op",0);
            feignForMQ.sendLightningConf(params);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/updateLightning", method = RequestMethod.POST)
    public Map<String, Object> updateLightning (@RequestBody Lightning lightning){
        System.out.println("进入修改方法！！！");
        RTU rtu = feignForRTU.selectRTUById(lightning.getRtu_id());
        System.out.println(lightning);

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("lightning",lightning);
        tempParams.put("op",0);
        String res = feignForMQ.sendLightningConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            lightningService.updateLightning(lightning);

            Map<String,Object> params = new HashMap<>();
            params.put("rtu",rtu);
            params.put("lightning",lightning);
            params.put("op",0);
            feignForMQ.sendLightningConf(params);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }


    }


    @RequestMapping(value = "/deleteLightning", method = RequestMethod.GET)
    public Map<String, Object> deleteLightning(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int ltn_id = Integer.parseInt(req.getParameter("ltn_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("ltn_id",ltn_id);
        params.put("rtu_port",rtu_port);

        Lightning lightning = lightningService.selectOneLight(params);
        System.out.println("查询后的lightning为 ： "+lightning);

        //int i = lightningService.deleteLightning(params);
        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("lightning",lightning);
        tempParams.put("op",1);
        String res = feignForMQ.sendLightningConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //删除rtuAlarmData相关信息
            lightningService.deleteRTUAlarmData(params);

            lightningService.deleteLightning(params);
            feignForMQ.sendLightningConf(tempParams);
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }
    }

    @RequestMapping(value = "/deleteLightningBySite", method = RequestMethod.GET)
    public void deleteLightningBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = lightningService.deleteLightningBySite(site_id);
    }

    @RequestMapping(value = "/deleteLightningByRTU", method = RequestMethod.GET)
    public void deleteLightningByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = lightningService.deleteLightningByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectAllLightningHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllLightningHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int site_id;
        if(req.getParameter("site_id") != null && req.getParameter("site_id") != ""){
            site_id = Integer.parseInt(req.getParameter("site_id"));
        }else {
            site_id = -1;
        }
        int rtu_id;
        if(req.getParameter("rtu_id") != null && req.getParameter("rtu_id") != ""){
            rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        }else {
            rtu_id = -1;
        }
        int ltn_id;
        if(req.getParameter("ltn_id") != null && req.getParameter("ltn_id") != ""){
            ltn_id = Integer.parseInt(req.getParameter("ltn_id"));
        }else {
            ltn_id = -1;
        }
        String ltn_location = req.getParameter("location");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("start",start);
        param.put("limit",limit);
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);
        param.put("ltn_id",ltn_id);
        param.put("ltn_location",ltn_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> LightningList = lightningService.selectLightningHistory(param);
        int count = lightningService.selectLightningHistoryCount(param);
        Map<String,Object> LightningListMap = new HashMap<>();
        LightningListMap.put("items",LightningList);
        LightningListMap.put("totals",count);
        return LightningListMap;

    }

    @RequestMapping(value = "/exportAllLightningHistory",method = RequestMethod.GET)
    public void exportAllLightningHistory (HttpServletRequest req, HttpServletResponse response){
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
        int site_id;
        if(req.getParameter("site_id") != null && req.getParameter("site_id") != ""){
            site_id = Integer.parseInt(req.getParameter("site_id"));
        }else {
            site_id = -1;
        }
        int rtu_id;
        if(req.getParameter("rtu_id") != null && req.getParameter("rtu_id") != ""){
            rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        }else {
            rtu_id = -1;
        }
        int ltn_id;
        if(req.getParameter("ltn_id") != null && req.getParameter("ltn_id") != ""){
            ltn_id = Integer.parseInt(req.getParameter("ltn_id"));
        }else {
            ltn_id = -1;
        }
        String ltn_location = req.getParameter("location");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("start",start);
        param.put("limit",limit);
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);
        param.put("ltn_id",ltn_id);
        param.put("ltn_location",ltn_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> LightningList = lightningService.exportLightningHistory(param);
        String sheetName = "测试";
        String fileName = "LightningExcel";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, LightningList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/selectLightningByRTU",method = RequestMethod.GET)
    public List<Map<String,Object>> selectLightningByRTU(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return lightningService.selectLightningByRTU(rtu_id);
        }else{
            return null;
        }
    }

}
