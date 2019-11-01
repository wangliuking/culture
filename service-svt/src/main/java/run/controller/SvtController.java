package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.RTU;
import run.bean.Svt;
import run.service.SvtService;
import run.util.ExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class SvtController {
    @Autowired
    private SvtService svtService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllSvt",method = RequestMethod.GET)
    public Map<String,Object> selectAllSvt (HttpServletRequest req, HttpServletResponse resp){
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
        List<Map<String,Object>> SvtList = svtService.selectAllSvt(param);
        int count = svtService.selectAllSvtCount(param);
        Map<String,Object> SvtListMap = new HashMap<>();
        SvtListMap.put("items",SvtList);
        SvtListMap.put("totals",count);
        return SvtListMap;

    }

    @RequestMapping(value = "/insertSvt", method = RequestMethod.POST)
    public Map<String, Object> insertSvt (@RequestBody Svt Svt){
        System.out.println("进入添加方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Svt.getRtu_id());
        System.out.println(Svt);

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("svt",Svt);
        tempParams.put("op",0);
        /*int i = svtService.insertSvt(Svt);
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
        //feignForMQ.sendSvtConfForRTU(tempParams);
        //feignForMQ.sendSvtConf(tempParams);
        String res = feignForMQ.sendSvtConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            svtService.insertSvt(Svt);
            feignForMQ.sendSvtConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/updateSvt", method = RequestMethod.POST)
    public Map<String, Object> updateSvt (@RequestBody Svt Svt){
        System.out.println("进入修改方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Svt.getRtu_id());
        System.out.println(Svt);

        /*int i = svtService.updateSvt(Svt);
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
        tempParams.put("svt",Svt);
        tempParams.put("op",0);
        String res = feignForMQ.sendSvtConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            svtService.updateSvt(Svt);
            feignForMQ.sendSvtConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }


    }


    @RequestMapping(value = "/deleteSvt", method = RequestMethod.GET)
    public Map<String, Object> deleteSvt(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int tilt_id = Integer.parseInt(req.getParameter("tilt_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("tilt_id",tilt_id);
        params.put("rtu_port",rtu_port);

        Svt Svt = svtService.selectOneLight(params);
        System.out.println("查询后的Svt为 ： "+Svt);

        /*int i = svtService.deleteSvt(params);
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
        tempParams.put("svt",Svt);
        tempParams.put("op",1);
        String res = feignForMQ.sendSvtConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //删除rtuAlarmData相关信息
            svtService.deleteRTUAlarmData(params);

            svtService.deleteSvt(params);
            feignForMQ.sendSvtConf(tempParams);
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }
    }

    @RequestMapping(value = "/deleteSvtBySite", method = RequestMethod.GET)
    public void deleteSvtBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = svtService.deleteSvtBySite(site_id);
    }

    @RequestMapping(value = "/deleteSvtByRTU", method = RequestMethod.GET)
    public void deleteSvtByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = svtService.deleteSvtByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectAllSvtHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllSvtHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int tilt_id;
        if(req.getParameter("tilt_id") != null && req.getParameter("tilt_id") != ""){
            tilt_id = Integer.parseInt(req.getParameter("tilt_id"));
        }else {
            tilt_id = -1;
        }
        String tilt_location = req.getParameter("location");
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
        param.put("tilt_id",tilt_id);
        param.put("tilt_location",tilt_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> SvtList = svtService.selectSvtHistory(param);
        int count = svtService.selectSvtHistoryCount(param);
        Map<String,Object> SvtListMap = new HashMap<>();
        SvtListMap.put("items",SvtList);
        SvtListMap.put("totals",count);
        return SvtListMap;

    }

    @RequestMapping(value = "/exportAllSvtHistory",method = RequestMethod.GET)
    public void exportAllSvtHistory (HttpServletRequest req, HttpServletResponse response){
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
        int tilt_id;
        if(req.getParameter("tilt_id") != null && req.getParameter("tilt_id") != ""){
            tilt_id = Integer.parseInt(req.getParameter("tilt_id"));
        }else {
            tilt_id = -1;
        }
        String tilt_location = req.getParameter("location");
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
        param.put("tilt_id",tilt_id);
        param.put("tilt_location",tilt_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> SvtList = svtService.exportSvtHistory(param);
        String sheetName = "测试";
        String fileName = "SvtExcel";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, SvtList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/selectSvtByRTU",method = RequestMethod.GET)
    public List<Map<String,Object>> selectSvtByRTU(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return svtService.selectSvtByRTU(rtu_id);
        }else{
            return null;
        }
    }

}
