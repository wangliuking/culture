package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.RTU;
import run.bean.Rsws;
import run.service.RswsService;
import run.util.ExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RswsController {
    @Autowired
    private RswsService RswsService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllRsws",method = RequestMethod.GET)
    public Map<String,Object> selectAllRsws (HttpServletRequest req, HttpServletResponse resp){
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
        List<Map<String,Object>> RswsList = RswsService.selectAllRsws(param);
        int count = RswsService.selectAllRswsCount(param);
        Map<String,Object> RswsListMap = new HashMap<>();
        RswsListMap.put("items",RswsList);
        RswsListMap.put("totals",count);
        return RswsListMap;

    }

    @RequestMapping(value = "/insertRsws", method = RequestMethod.POST)
    public Map<String, Object> insertRsws (@RequestBody Rsws Rsws){
        System.out.println("进入添加方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Rsws.getRtu_id());
        System.out.println(Rsws);

        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("rsws",Rsws);
        tempParams.put("op",0);
        /*int i = RswsService.insertRsws(Rsws);
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
        //feignForMQ.sendRswsConfForRTU(tempParams);
        //feignForMQ.sendRswsConf(tempParams);
        String res = feignForMQ.sendRswsConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            RswsService.insertRsws(Rsws);
            feignForMQ.sendRswsConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/updateRsws", method = RequestMethod.POST)
    public Map<String, Object> updateRsws (@RequestBody Rsws Rsws){
        System.out.println("进入修改方法！！！");
        RTU rtu = feignForRTU.selectRTUById(Rsws.getRtu_id());
        System.out.println(Rsws);

        /*int i = RswsService.updateRsws(Rsws);
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
        tempParams.put("rsws",Rsws);
        tempParams.put("op",0);
        String res = feignForMQ.sendRswsConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            RswsService.updateRsws(Rsws);
            feignForMQ.sendRswsConf(tempParams);

            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }


    }


    @RequestMapping(value = "/deleteRsws", method = RequestMethod.GET)
    public Map<String, Object> deleteRsws(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int hmt_id = Integer.parseInt(req.getParameter("hmt_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("hmt_id",hmt_id);
        params.put("rtu_port",rtu_port);

        Rsws Rsws = RswsService.selectOneLight(params);
        System.out.println("查询后的Rsws为 ： "+Rsws);

        /*int i = RswsService.deleteRsws(params);
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
        tempParams.put("rsws",Rsws);
        tempParams.put("op",1);
        String res = feignForMQ.sendRswsConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //删除rtuAlarmData相关信息
            RswsService.deleteRTUAlarmData(params);

            RswsService.deleteRsws(params);
            feignForMQ.sendRswsConf(tempParams);
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }
    }

    @RequestMapping(value = "/deleteRswsBySite", method = RequestMethod.GET)
    public void deleteRswsBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = RswsService.deleteRswsBySite(site_id);
    }

    @RequestMapping(value = "/deleteRswsByRTU", method = RequestMethod.GET)
    public void deleteRswsByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = RswsService.deleteRswsByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectAllRswsHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllRswsHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int hmt_id;
        if(req.getParameter("hmt_id") != null && req.getParameter("hmt_id") != ""){
            hmt_id = Integer.parseInt(req.getParameter("hmt_id"));
        }else {
            hmt_id = -1;
        }
        String hmt_location = req.getParameter("location");
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
        param.put("hmt_id",hmt_id);
        param.put("hmt_location",hmt_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> RswsList = RswsService.selectRswsHistory(param);
        int count = RswsService.selectRswsHistoryCount(param);
        Map<String,Object> RswsListMap = new HashMap<>();
        RswsListMap.put("items",RswsList);
        RswsListMap.put("totals",count);
        return RswsListMap;

    }

    @RequestMapping(value = "/exportAllRswsHistory",method = RequestMethod.GET)
    public void exportAllRswsHistory (HttpServletRequest req, HttpServletResponse response){
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
        int hmt_id;
        if(req.getParameter("hmt_id") != null && req.getParameter("hmt_id") != ""){
            hmt_id = Integer.parseInt(req.getParameter("hmt_id"));
        }else {
            hmt_id = -1;
        }
        String hmt_location = req.getParameter("location");
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
        param.put("hmt_id",hmt_id);
        param.put("hmt_location",hmt_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> RswsList = RswsService.exportRswsHistory(param);
        String sheetName = "测试";
        String fileName = "RswsExcel";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, RswsList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/selectRswsByRTU",method = RequestMethod.GET)
    public List<Map<String,Object>> selectRswsByRTU(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return RswsService.selectRswsByRTU(rtu_id);
        }else{
            return null;
        }
    }

}
