package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.RTU;
import run.bean.Stray;
import run.service.StrayService;
import run.util.ExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class StrayController {
    @Autowired
    private StrayService strayService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllStray",method = RequestMethod.GET)
    public Map<String,Object> selectAllStray (HttpServletRequest req, HttpServletResponse resp){
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

        List<Map<String,Object>> StrayList = strayService.selectAllStray(param);
        int count = strayService.selectAllStrayCount(param);
        Map<String,Object> StrayListMap = new HashMap<>();
        StrayListMap.put("items",StrayList);
        StrayListMap.put("totals",count);
        return StrayListMap;

    }

    @RequestMapping(value = "/insertStray", method = RequestMethod.POST)
    public Map<String, Object> insertStray (@RequestBody Stray stray){
        System.out.println("进入添加方法！！！");
        RTU rtu = feignForRTU.selectRTUById(stray.getRtu_id());
        System.out.println(stray);
        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("stray",stray);
        tempParams.put("op",0);
        String res = feignForMQ.sendStrayConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //判断485还是模拟
            int i=0;
            if(stray.getEquipType() == 1){
                if(!"".equals(stray.getPortName1())){
                    stray.setPortId(1);
                    stray.setPortName(stray.getPortName1());
                    stray.setComputeType(stray.getComputeType1());
                    stray.setFactor(stray.getFactor1());
                    stray.setFullscale(stray.getFullscale1());
                    stray.setCalvalue(stray.getCalvalue1());
                    stray.setStret_threshold1(stray.getStret_threshold1_1());
                    stray.setStret_threshold2(stray.getStret_threshold2_1());
                    strayService.insertStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName2())){
                    stray.setPortId(2);
                    stray.setPortName(stray.getPortName2());
                    stray.setComputeType(stray.getComputeType2());
                    stray.setFactor(stray.getFactor2());
                    stray.setFullscale(stray.getFullscale2());
                    stray.setCalvalue(stray.getCalvalue2());
                    stray.setStret_threshold1(stray.getStret_threshold1_2());
                    stray.setStret_threshold2(stray.getStret_threshold2_2());
                    strayService.insertStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName3())){
                    stray.setPortId(3);
                    stray.setPortName(stray.getPortName3());
                    stray.setComputeType(stray.getComputeType3());
                    stray.setFactor(stray.getFactor3());
                    stray.setFullscale(stray.getFullscale3());
                    stray.setCalvalue(stray.getCalvalue3());
                    stray.setStret_threshold1(stray.getStret_threshold1_3());
                    stray.setStret_threshold2(stray.getStret_threshold2_3());
                    strayService.insertStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName4())){
                    stray.setPortId(4);
                    stray.setPortName(stray.getPortName4());
                    stray.setComputeType(stray.getComputeType4());
                    stray.setFactor(stray.getFactor4());
                    stray.setFullscale(stray.getFullscale4());
                    stray.setCalvalue(stray.getCalvalue4());
                    stray.setStret_threshold1(stray.getStret_threshold1_4());
                    stray.setStret_threshold2(stray.getStret_threshold2_4());
                    strayService.insertStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }
            }else if(stray.getEquipType() == 2){
                strayService.insertStray(stray);
                feignForMQ.sendStrayConf(tempParams);
            }
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/updateStray", method = RequestMethod.POST)
    public Map<String, Object> updateStray (@RequestBody Stray stray){
        System.out.println("进入修改方法！！！");
        RTU rtu = feignForRTU.selectRTUById(stray.getRtu_id());
        System.out.println(stray);
        Map<String,Object> tempParams = new HashMap<>();
        tempParams.put("rtu",rtu);
        tempParams.put("stray",stray);
        tempParams.put("op",0);
        String res = feignForMQ.sendStrayConfForRTU(tempParams);
        Map<String,Object> map = new HashMap<>();
        if("配置成功".equals(res)){
            //判断485还是模拟
            int i=0;
            if(stray.getEquipType() == 1){
                if(!"".equals(stray.getPortName1())){
                    stray.setPortId(1);
                    stray.setPortName(stray.getPortName1());
                    stray.setComputeType(stray.getComputeType1());
                    stray.setFactor(stray.getFactor1());
                    stray.setFullscale(stray.getFullscale1());
                    stray.setCalvalue(stray.getCalvalue1());
                    stray.setStret_threshold1(stray.getStret_threshold1_1());
                    stray.setStret_threshold2(stray.getStret_threshold2_1());
                    strayService.updateStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName2())){
                    stray.setPortId(2);
                    stray.setPortName(stray.getPortName2());
                    stray.setComputeType(stray.getComputeType2());
                    stray.setFactor(stray.getFactor2());
                    stray.setFullscale(stray.getFullscale2());
                    stray.setCalvalue(stray.getCalvalue2());
                    stray.setStret_threshold1(stray.getStret_threshold1_2());
                    stray.setStret_threshold2(stray.getStret_threshold2_2());
                    strayService.updateStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName3())){
                    stray.setPortId(3);
                    stray.setPortName(stray.getPortName3());
                    stray.setComputeType(stray.getComputeType3());
                    stray.setFactor(stray.getFactor3());
                    stray.setFullscale(stray.getFullscale3());
                    stray.setCalvalue(stray.getCalvalue3());
                    stray.setStret_threshold1(stray.getStret_threshold1_3());
                    stray.setStret_threshold2(stray.getStret_threshold2_3());
                    strayService.updateStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }

                if(!"".equals(stray.getPortName4())){
                    stray.setPortId(4);
                    stray.setPortName(stray.getPortName4());
                    stray.setComputeType(stray.getComputeType4());
                    stray.setFactor(stray.getFactor4());
                    stray.setFullscale(stray.getFullscale4());
                    stray.setCalvalue(stray.getCalvalue4());
                    stray.setStret_threshold1(stray.getStret_threshold1_4());
                    stray.setStret_threshold2(stray.getStret_threshold2_4());
                    strayService.updateStray(stray);
                    feignForMQ.sendStrayConf(tempParams);
                }
            }else if(stray.getEquipType() == 2){
                strayService.updateStray(stray);
                feignForMQ.sendStrayConf(tempParams);
            }
            map.put("success",true);
            map.put("message",res);
            return map;
        }else{
            map.put("success",false);
            map.put("message",res);
            return map;
        }

    }


    @RequestMapping(value = "/deleteStray", method = RequestMethod.GET)
    public Map<String, Object> deleteStray(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int stret_id = Integer.parseInt(req.getParameter("stret_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("stret_id",stret_id);
        params.put("rtu_port",rtu_port);

        List<Stray> list = strayService.selectStray(params);
        if(list != null && list.size()>0){
            Stray stray = list.get(0);
            Map<String,Object> tempParams = new HashMap<>();
            tempParams.put("rtu",rtu);
            tempParams.put("stray",stray);
            tempParams.put("op",1);
            String res = feignForMQ.sendStrayConfForRTU(tempParams);
            Map<String,Object> map = new HashMap<>();
            if("配置成功".equals(res)){
                //删除rtuAlarmData相关信息
                strayService.deleteRTUAlarmData(params);

                strayService.deleteStray(params);
                for(int i=0;i<list.size();i++){
                    Stray temp = list.get(i);
                    Map<String,Object> parameters = new HashMap<>();
                    parameters.put("rtu",rtu);
                    parameters.put("stray",temp);
                    parameters.put("op",1);
                    feignForMQ.sendStrayConf(parameters);
                }
                map.put("success",true);
                map.put("message",res);
                return map;
            }else{
                map.put("success",false);
                map.put("message",res);
                return map;
            }

        }
        return null;

    }

    @RequestMapping(value = "/selectStray", method = RequestMethod.GET)
    public Map<String, Object> selectStray(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int stret_id = Integer.parseInt(req.getParameter("stret_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("stret_id",stret_id);
        params.put("rtu_port",rtu_port);
        List<Stray> list = strayService.selectStray(params);

        Map<String,Object> map = new HashMap<>();
        if(list != null){
            Stray stray = list.get(0);
            if(stray.getEquipType() == 1){
                for(int i=0;i<list.size();i++){
                    Stray s = list.get(i);
                    if(s.getPortId() == 1){
                        stray.setPortName1(s.getPortName());
                        stray.setComputeType1(s.getComputeType());
                        stray.setFactor1(s.getFactor());
                        stray.setFullscale1(s.getFullscale());
                        stray.setCalvalue1(s.getCalvalue());
                        stray.setStret_threshold1_1(s.getStret_threshold1());
                        stray.setStret_threshold2_1(s.getStret_threshold2());
                    }
                    if(s.getPortId() == 2){
                        stray.setPortName2(s.getPortName());
                        stray.setComputeType2(s.getComputeType());
                        stray.setFactor2(s.getFactor());
                        stray.setFullscale2(s.getFullscale());
                        stray.setCalvalue2(s.getCalvalue());
                        stray.setStret_threshold1_2(s.getStret_threshold1());
                        stray.setStret_threshold2_2(s.getStret_threshold2());
                    }
                    if(s.getPortId() == 3){
                        stray.setPortName3(s.getPortName());
                        stray.setComputeType3(s.getComputeType());
                        stray.setFactor3(s.getFactor());
                        stray.setFullscale3(s.getFullscale());
                        stray.setCalvalue3(s.getCalvalue());
                        stray.setStret_threshold1_3(s.getStret_threshold1());
                        stray.setStret_threshold2_3(s.getStret_threshold2());
                    }
                    if(s.getPortId() == 4){
                        stray.setPortName4(s.getPortName());
                        stray.setComputeType4(s.getComputeType());
                        stray.setFactor4(s.getFactor());
                        stray.setFullscale4(s.getFullscale());
                        stray.setCalvalue4(s.getCalvalue());
                        stray.setStret_threshold1_4(s.getStret_threshold1());
                        stray.setStret_threshold2_4(s.getStret_threshold2());
                    }
                }
                map.put("items",stray);
            }else if(stray.getEquipType() == 2){
                map.put("items",stray);
            }

        }

        return map;
    }

    @RequestMapping(value = "/deleteStrayBySite", method = RequestMethod.GET)
    public void deleteStrayBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = strayService.deleteStrayBySite(site_id);
    }

    @RequestMapping(value = "/deleteStrayByRTU", method = RequestMethod.GET)
    public void deleteStrayByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = strayService.deleteStrayByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectAllStrayHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllStrayHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int stret_id;
        if(req.getParameter("stret_id") != null && req.getParameter("stret_id") != ""){
            stret_id = Integer.parseInt(req.getParameter("stret_id"));
        }else {
            stret_id = -1;
        }
        String stret_location = req.getParameter("location");
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
        param.put("stret_id",stret_id);
        param.put("stret_location",stret_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> StrayList = strayService.selectStrayHistory(param);
        int count = strayService.selectStrayHistoryCount(param);
        Map<String,Object> StrayListMap = new HashMap<>();
        StrayListMap.put("items",StrayList);
        StrayListMap.put("totals",count);
        return StrayListMap;

    }

    @RequestMapping(value = "/exportAllStrayHistory",method = RequestMethod.GET)
    public void exportAllStrayHistory (HttpServletRequest req, HttpServletResponse response){
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
        int stret_id;
        if(req.getParameter("stret_id") != null && req.getParameter("stret_id") != ""){
            stret_id = Integer.parseInt(req.getParameter("stret_id"));
        }else {
            stret_id = -1;
        }
        String stret_location = req.getParameter("location");
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
        param.put("stret_id",stret_id);
        param.put("stret_location",stret_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> StrayList = strayService.exportStrayHistory(param);
        String sheetName = "测试";
        String fileName = "StrayExcel.xls";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, StrayList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }

    }

    @RequestMapping(value = "/selectStrayByRTU",method = RequestMethod.GET)
    public List<Map<String,Object>> selectStrayByRTU(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return strayService.selectStrayByRTU(rtu_id);
        }else{
            return null;
        }
    }

}
