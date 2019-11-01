package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.Hc;
import run.bean.RTU;
import run.service.HcService;
import run.util.ExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class HcController {
    @Autowired
    private HcService hcService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllHc",method = RequestMethod.GET)
    public Map<String,Object> selectAllHc (HttpServletRequest req, HttpServletResponse resp){
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

        List<Map<String,Object>> HcList = hcService.selectAllHc(param);
        int count = hcService.selectAllHcCount(param);
        Map<String,Object> HcListMap = new HashMap<>();
        HcListMap.put("items",HcList);
        HcListMap.put("totals",count);
        return HcListMap;

    }

    @RequestMapping(value = "/insertHc", method = RequestMethod.POST)
    public Map<String, Object> insertHc (@RequestBody Hc Hc){
        System.out.println("进入添加方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Hc.getRtu_id());
        System.out.println(Hc);

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("hc",Hc);
        tempParams.put("op",0);
        /*int i = hcService.insertHc(Hc);
        Map<String,Object> map = new HashMap<>();
        if(i>0){
            map.put("success",true);
            map.put("message","添加成功");
            return map;
        }else{
            map.put("success",true);
            map.put("message","添加失败");
            return map;
        }*/
        //feignForMQ.sendHcConfForRTU(tempParams);
        //feignForMQ.sendHcConf(tempParams);
        String res = feignForMQ.sendHcConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            hcService.insertHc(Hc);
            feignForMQ.sendHcConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/updateHc", method = RequestMethod.POST)
    public Map<String, Object> updateHc (@RequestBody Hc Hc){
        System.out.println("进入修改方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Hc.getRtu_id());
        System.out.println(Hc);

        /*int i = hcService.updateHc(Hc);
        Map<String,Object> map = new HashMap<>();
        if(i>0){
            map.put("success",true);
            map.put("message","更新成功");
            return map;
        }else{
            map.put("success",true);
            map.put("message","更新失败");
            return map;
        }*/

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("hc",Hc);
        tempParams.put("op",0);
        String res = feignForMQ.sendHcConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            hcService.updateHc(Hc);
            feignForMQ.sendHcConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }


    }


    @RequestMapping(value = "/deleteHc", method = RequestMethod.GET)
    public Map<String, Object> deleteHc(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int es_id = Integer.parseInt(req.getParameter("es_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("es_id",es_id);
        params.put("rtu_port",rtu_port);

        Hc Hc = hcService.selectOneLight(params);
        System.out.println("查询后的Hc为 ： "+Hc);

        /*int i = hcService.deleteHc(params);
        Map<String,Object> map = new HashMap<>();
        if(i>0){
            map.put("success",true);
            map.put("message","删除成功");
            return map;
        }else{
            map.put("success",true);
            map.put("message","删除失败");
            return map;
        }*/

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("hc",Hc);
        tempParams.put("op",1);
        String res = feignForMQ.sendHcConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //删除rtuAlarmData相关信息
            hcService.deleteRTUAlarmData(params);

            hcService.deleteHc(params);
            feignForMQ.sendHcConf(tempParams);
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }
    }

    @RequestMapping(value = "/deleteHcBySite", method = RequestMethod.GET)
    public void deleteHcBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = hcService.deleteHcBySite(site_id);
    }

    @RequestMapping(value = "/deleteHcByRTU", method = RequestMethod.GET)
    public void deleteHcByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = hcService.deleteHcByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectAllHcHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllHcHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int es_id;
        if(req.getParameter("es_id") != null && req.getParameter("es_id") != ""){
            es_id = Integer.parseInt(req.getParameter("es_id"));
        }else {
            es_id = -1;
        }
        String es_location = req.getParameter("location");
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
        param.put("es_id",es_id);
        param.put("es_location",es_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> HcList = hcService.selectHcHistory(param);
        int count = hcService.selectHcHistoryCount(param);
        Map<String,Object> HcListMap = new HashMap<>();
        HcListMap.put("items",HcList);
        HcListMap.put("totals",count);
        return HcListMap;

    }

    @RequestMapping(value = "/exportAllHcHistory",method = RequestMethod.GET)
    public void exportAllHcHistory (HttpServletRequest req, HttpServletResponse response){
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
        int es_id;
        if(req.getParameter("es_id") != null && req.getParameter("es_id") != ""){
            es_id = Integer.parseInt(req.getParameter("es_id"));
        }else {
            es_id = -1;
        }
        String es_location = req.getParameter("location");
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
        param.put("es_id",es_id);
        param.put("es_location",es_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> HcList = hcService.exportHcHistory(param);
        String sheetName = "测试";
        String fileName = "HcExcel";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, HcList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/selectHcByRTU",method = RequestMethod.GET)
    public List<Map<String,Object>> selectHcByRTU(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return hcService.selectHcByRTU(rtu_id);
        }else{
            return null;
        }
    }

}
