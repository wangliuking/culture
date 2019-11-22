package run.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.RTU;
import run.service.TotalService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class TotalController {
    @Autowired
    private TotalService totalService;
    @Autowired
    private FeignForStructure feignForStructure;
    @Autowired
    private FeignForWeChat feignForWeChat;

    @RequestMapping(value = "/selectSiteAllStatus",method = RequestMethod.GET)
    public Map<String,Object> selectSiteAllStatus(HttpServletRequest req){
        String siteId = req.getParameter("site_id");
        Map<String,Object> param = new HashMap<>();
        if(siteId != null && !"".equals(siteId)){
            int site_id = Integer.parseInt(siteId);
            param.put("rtu_id","");
            param.put("site_id",site_id);
        }else{
            param.put("rtu_id","");
            param.put("site_id","");
        }
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);
        List<Map<String,Object>> rtuOffNum = totalService.selectRTUOff(param);
        List<Map<String,Object>> rtuWarningNum = totalService.selectRTUWarning(param);
        List<Integer> rtuStatusList = totalService.selectRTUStatusBySiteId(param);
        int rtuNum = totalService.selectRTUNumBySiteId(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("rtuStatusList",rtuStatusList.size());
        resultMap.put("rtuOffNum",rtuOffNum.size());
        resultMap.put("rtuWarningNum",rtuWarningNum.size());
        resultMap.put("rtuNum",rtuNum);
        return resultMap;
    }

    @RequestMapping(value = "/selectSiteAllInfo",method = RequestMethod.GET)
    public Map<String,Object> selectSiteAllInfo(HttpServletRequest req){
        String rtuId = req.getParameter("rtu_id");
        String siteId = req.getParameter("site_id");
        Map<String,Object> param = new HashMap<>();
        if(rtuId != null && !"".equals(rtuId)){
            int rtu_id = Integer.parseInt(rtuId);
            param.put("rtu_id",rtu_id);
            param.put("site_id","");
        }else if(siteId != null && !"".equals(siteId)){
            int site_id = Integer.parseInt(siteId);
            param.put("rtu_id","");
            param.put("site_id",site_id);
        }else{
            param.put("rtu_id","");
            param.put("site_id","");
        }
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);

        List<Map<String,Object>> siteInfo = totalService.selectSiteById(param);
        List<Map<String,Object>> deviceOff = totalService.selectDeviceOff(param);
        List<Map<String,Object>> deviceWarning = totalService.selectDeviceWarning(param);
        int rtuNum = totalService.selectRTUNumBySiteId(param);
        List<Map<String,Object>> rtuOffNum = totalService.selectRTUOff(param);
        List<Map<String,Object>> rtuWarningNum = totalService.selectRTUWarning(param);
        List<Map<String,Object>> spdNum = totalService.selectSPDCount(param);
        List<Map<String,Object>> etcrNum = totalService.selectETCRCount(param);
        List<Map<String,Object>> lightningNum = totalService.selectLightningCount(param);
        List<Map<String,Object>> staticNum = totalService.selectStaticCount(param);
        List<Map<String,Object>> rswsNum = totalService.selectRswsCount(param);
        List<Map<String,Object>> svtNum = totalService.selectSvtCount(param);
        List<Map<String,Object>> hcNum = totalService.selectHcCount(param);
        List<Map<String,Object>> strayNum = totalService.selectStrayCount(param);
        List<Map<String,Object>> catNum = totalService.selectCatCount(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("siteInfo",siteInfo);
        System.out.println(" siteInfo : "+siteInfo);
        resultMap.put("deviceOffCount",deviceOff.size());
        resultMap.put("deviceWarningCount",deviceWarning.size());
        resultMap.put("rtuNum",rtuNum);
        resultMap.put("rtuOffNum",rtuOffNum.size());
        resultMap.put("rtuWarningNum",rtuWarningNum.size());
        resultMap.put("spdNum",spdNum.size());
        resultMap.put("etcrNum",etcrNum.size());
        resultMap.put("lightningNum",lightningNum.size());
        resultMap.put("staticNum",staticNum.size());
        resultMap.put("rswsNum",rswsNum.size());
        resultMap.put("svtNum",svtNum.size());
        resultMap.put("hcNum",hcNum.size());
        resultMap.put("strayNum",strayNum.size());
        resultMap.put("catNum",catNum.size());
        return resultMap;
    }

    @RequestMapping(value = "/selectDeviceNum",method = RequestMethod.GET)
    public Map<String,Object> selectDeviceNum(HttpServletRequest req){
        String rtuId = req.getParameter("rtu_id");
        String siteId = req.getParameter("site_id");
        Map<String,Object> param = new HashMap<>();
        if(rtuId != null && !"".equals(rtuId)){
            int rtu_id = Integer.parseInt(rtuId);
            Map<String,Object> tMap = totalService.selectRTUById(rtu_id);
            int site_id = Integer.parseInt(tMap.get("site_id")+"");
            param.put("rtu_id",rtu_id);
            param.put("site_id",site_id);
        }else if(siteId != null && !"".equals(siteId)){
            int site_id = Integer.parseInt(siteId);
            param.put("rtu_id","");
            param.put("site_id",site_id);
        }else{
            param.put("rtu_id","");
            param.put("site_id","");
        }

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);

        Map<String,Object> siteInfo = totalService.selectSiteById(param).get(0);
        List<Map<String,Object>> deviceOff = totalService.selectDeviceOff(param);
        List<Map<String,Object>> deviceWarning = totalService.selectDeviceWarning(param);
        int rtuNum = totalService.selectRTUNumBySiteId(param);
        List<Map<String,Object>> spdNum = totalService.selectSPDCount(param);
        List<Map<String,Object>> etcrNum = totalService.selectETCRCount(param);
        List<Map<String,Object>> lightningNum = totalService.selectLightningCount(param);
        List<Map<String,Object>> staticNum = totalService.selectStaticCount(param);
        List<Map<String,Object>> rswsNum = totalService.selectRswsCount(param);
        List<Map<String,Object>> svtNum = totalService.selectSvtCount(param);
        List<Map<String,Object>> hcNum = totalService.selectHcCount(param);
        List<Map<String,Object>> strayNum = totalService.selectStrayCount(param);
        List<Map<String,Object>> catNum = totalService.selectCatCount(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("siteInfo",siteInfo);
        resultMap.put("deviceOffCount",deviceOff.size());
        resultMap.put("deviceWarningCount",deviceWarning.size());
        resultMap.put("rtuNum",rtuNum);
        resultMap.put("spdNum",spdNum.size());
        resultMap.put("etcrNum",etcrNum.size());
        resultMap.put("lightningNum",lightningNum.size());
        resultMap.put("staticNum",staticNum.size());
        resultMap.put("rswsNum",rswsNum.size());
        resultMap.put("svtNum",svtNum.size());
        resultMap.put("hcNum",hcNum.size());
        resultMap.put("strayNum",strayNum.size());
        resultMap.put("catNum",catNum.size());
        return resultMap;
    }

    @RequestMapping(value = "/selectRTUPort",method = RequestMethod.GET)
    public Map<String,Object> selectRTUPort(HttpServletRequest req){
        String rtuId = req.getParameter("rtu_id");
        Map<String,Object> param = new HashMap<>();
        if(rtuId != null && !"".equals(rtuId)){
            int rtu_id = Integer.parseInt(rtuId);
            param.put("rtu_id",rtu_id);
        }
        Map<String,Object> resultMap = new HashMap<>();
        //数字量
        List<Map<String,Object>> spdPort = totalService.selectSPDPort(param);
        resultMap.put("spdPort",spdPort);
        //模拟量
        List<Map<Integer,String>> testList = new ArrayList<>();
        List<Map<String,Object>> staryTest = totalService.selectStrayTestPort(param);
        if(staryTest != null){
            for(int i=0;i<staryTest.size();i++){
                String t = staryTest.get(i).get("rtu_port")+"";
                int temp = Integer.parseInt(t);
                Map<Integer,String> tempMap = new HashMap<>();
                tempMap.put(temp,"杂散电流");
                tempMap.put(0,staryTest.get(i).get("stret_state")+"");
                tempMap.put(-1,staryTest.get(i).get("alarm")+"");
                testList.add(tempMap);
            }
        }
        List<Map<String,Object>> catTest = totalService.selectCatTestPort(param);
        if(catTest != null){
            for(int i=0;i<catTest.size();i++){
                String t = catTest.get(i).get("rtu_port")+"";
                int temp = Integer.parseInt(t);
                Map<Integer,String> tempMap = new HashMap<>();
                tempMap.put(temp,"阴极保护");
                tempMap.put(0,catTest.get(i).get("cathode_state")+"");
                tempMap.put(-1,catTest.get(i).get("alarm")+"");
                testList.add(tempMap);
            }
        }
        resultMap.put("testList",testList);
        //485
        List<Map<String,Object>> rs485List = new ArrayList<>();
        List<Map<String,Object>> etcrPort = totalService.selectETCRPort(param);
        if(etcrPort != null){
            for(int i=0;i<etcrPort.size();i++){
                String temp = etcrPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","接地电阻");
                tempMap.put("port",temp);
                tempMap.put("status",etcrPort.get(i).get("rst_state")+"");
                tempMap.put("deviceId",etcrPort.get(i).get("rst_id")+"");
                tempMap.put("alarm",etcrPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> lightningPort = totalService.selectLightningPort(param);
        if(lightningPort != null){
            for(int i=0;i<lightningPort.size();i++){
                String temp = lightningPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","雷电流");
                tempMap.put("port",temp);
                tempMap.put("status",lightningPort.get(i).get("ltn_state")+"");
                tempMap.put("deviceId",lightningPort.get(i).get("ltn_id")+"");
                tempMap.put("alarm",lightningPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> staticPort = totalService.selectStaticPort(param);
        if(staticPort != null){
            for(int i=0;i<staticPort.size();i++){
                String temp = staticPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","静电");
                tempMap.put("port",temp);
                tempMap.put("status",staticPort.get(i).get("staet_state")+"");
                tempMap.put("deviceId",staticPort.get(i).get("staet_id")+"");
                tempMap.put("alarm",staticPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> rswsPort = totalService.selectRswsPort(param);
        if(rswsPort != null){
            for(int i=0;i<rswsPort.size();i++){
                String temp = rswsPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","温湿度");
                tempMap.put("port",temp);
                tempMap.put("status",rswsPort.get(i).get("hmt_state")+"");
                tempMap.put("deviceId",rswsPort.get(i).get("hmt_id")+"");
                tempMap.put("alarm",rswsPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> svtPort = totalService.selectSvtPort(param);
        if(svtPort != null){
            for(int i=0;i<svtPort.size();i++){
                String temp = svtPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","倾斜度");
                tempMap.put("port",temp);
                tempMap.put("status",svtPort.get(i).get("tilt_state")+"");
                tempMap.put("deviceId",svtPort.get(i).get("tilt_id")+"");
                tempMap.put("alarm",svtPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> hcPort = totalService.selectHcPort(param);
        if(hcPort != null){
            for(int i=0;i<hcPort.size();i++){
                String temp = hcPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","电气安全");
                tempMap.put("port",temp);
                tempMap.put("status",hcPort.get(i).get("es_state")+"");
                tempMap.put("deviceId",hcPort.get(i).get("es_id")+"");
                tempMap.put("alarm",hcPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> strayPort = totalService.selectStray485Port(param);
        if(strayPort != null){
            for(int i=0;i<strayPort.size();i++){
                String temp = strayPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","杂散电流");
                tempMap.put("port",temp);
                tempMap.put("status",strayPort.get(i).get("stret_state")+"");
                tempMap.put("deviceId",strayPort.get(i).get("stret_id")+"");
                tempMap.put("alarm",strayPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        List<Map<String,Object>> catPort = totalService.selectCat485Port(param);
        if(catPort != null){
            for(int i=0;i<catPort.size();i++){
                String temp = catPort.get(i).get("rtu_port")+"";
                Map<String,Object> tempMap = new HashMap<>();
                tempMap.put("type","阴极保护");
                tempMap.put("port",temp);
                tempMap.put("status",catPort.get(i).get("cathode_state")+"");
                tempMap.put("deviceId",catPort.get(i).get("cathode_id")+"");
                tempMap.put("alarm",catPort.get(i).get("alarm")+"");
                rs485List.add(tempMap);
            }
        }
        resultMap.put("rs485List",rs485List);
        return resultMap;
    }

    @RequestMapping(value = "/selectAlarmByMonth",method = RequestMethod.GET)
    public Map<String,Object> selectAlarmByMonth(HttpServletRequest req){
        Date d = new Date();
        long l = d.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<Object> list = new LinkedList<>();
        for(int i=0;i<30;i++){
            String temp = sdf.format(l);
            list.add(temp);
            l -= 24*60*60*1000;
        }
        System.out.println(list);
        Map<String,Object> param = new HashMap<>();
        param.put("startTime",list.get(list.size()-1)+" 00:00:00");
        param.put("endTime",list.get(0)+" 23:59:59");
        String site_id = req.getParameter("site_id");
        String rtu_id = req.getParameter("rtu_id");
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);

        List<Map<String,Object>> deviceOffTemp = totalService.selectDeviceOffByMonth(param);
        List<Integer> deviceOffList = new LinkedList<>();
        for(int i=0;i<list.size();i++){
            String temp = list.get(i)+"";
            //标志状态位,判断是否查询到
            int status = 0;
            for(int j=0;j<deviceOffTemp.size();j++){
                Map<String,Object> map = deviceOffTemp.get(j);
                String tempDate = map.get("tempDate")+"";
                if(temp.equals(tempDate)){
                    deviceOffList.add(Integer.parseInt(map.get("num")+""));
                    status = 1;
                    break;
                }
            }
            if(status == 0){
                //未查询到
                deviceOffList.add(0);
            }
        }

        List<Map<String,Object>> deviceWarningTemp = totalService.selectDeviceWarningByMonth(param);
        List<Integer> deviceWarningList = new LinkedList<>();
        for(int i=0;i<list.size();i++){
            String temp = list.get(i)+"";
            //标志状态位,判断是否查询到
            int status = 0;
            for(int j=0;j<deviceWarningTemp.size();j++){
                Map<String,Object> map = deviceWarningTemp.get(j);
                String tempDate = map.get("tempDate")+"";
                if(temp.equals(tempDate)){
                    deviceWarningList.add(Integer.parseInt(map.get("num")+""));
                    status = 1;
                    break;
                }
            }
            if(status == 0){
                //未查询到
                deviceWarningList.add(0);
            }
        }

        List<Map<String,Object>> rtuOffTemp = totalService.selectRTUOffByMonth(param);
        List<Integer> rtuOffList = new LinkedList<>();
        for(int i=0;i<list.size();i++){
            String temp = list.get(i)+"";
            //标志状态位,判断是否查询到
            int status = 0;
            for(int j=0;j<rtuOffTemp.size();j++){
                Map<String,Object> map = rtuOffTemp.get(j);
                String tempDate = map.get("tempDate")+"";
                if(temp.equals(tempDate)){
                    rtuOffList.add(Integer.parseInt(map.get("num")+""));
                    status = 1;
                    break;
                }
            }
            if(status == 0){
                //未查询到
                rtuOffList.add(0);
            }
        }

        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("deviceOffList",deviceOffList);
        resultMap.put("deviceWarningList",deviceWarningList);
        resultMap.put("rtuOffList",rtuOffList);
        resultMap.put("list",list);
        return resultMap;
    }

    public static void main(String[] args) {

        Date d = new Date();
        long l = d.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        List<Object> list = new LinkedList<>();
        for(int i=0;i<30;i++){
            String temp = sdf.format(l);
            list.add(temp);
            l -= 24*60*60*1000;
        }
        System.out.println(list);
        System.out.println(list.get(0)+"==="+list.get(list.size()-1));
    }

    @RequestMapping(value = "/selectForFeignMQ",method = RequestMethod.GET)
    public Map<String,Object> selectForFeignMQ(HttpServletRequest req){
        String rtuId = req.getParameter("rtu_id");
        String siteId = req.getParameter("site_id");
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        if(rtuId != null && !"".equals(rtuId)){
            int rtu_id = Integer.parseInt(rtuId);
            param.put("rtu_id",rtu_id);
            param.put("site_id","");
        }else if(siteId != null && !"".equals(siteId)){
            int site_id = Integer.parseInt(siteId);
            param.put("rtu_id","");
            param.put("site_id",site_id);
        }else{
            param.put("rtu_id","");
            param.put("site_id","");
        }
        param.put("strList",strList);
        System.out.println("param : "+param);
        //List<Map<String,Object>> deviceOff = totalService.selectDeviceOff(param);
        List<Map<String,Object>> deviceWarning = totalService.selectDeviceWarning(param);
        int rtuNum = totalService.selectRTUNumBySiteId(param);
        List<Map<String,Object>> rtuOffNum = totalService.selectRTUOff(param);
        List<Map<String,Object>> rtuWarningNum = totalService.selectRTUWarning(param);
        List<Map<String,Object>> spdNum = totalService.selectSPDCount(param);
        List<Map<String,Object>> etcrNum = totalService.selectETCRCount(param);
        List<Map<String,Object>> lightningNum = totalService.selectLightningCount(param);
        List<Map<String,Object>> staticNum = totalService.selectStaticCount(param);
        List<Map<String,Object>> rswsNum = totalService.selectRswsCount(param);
        List<Map<String,Object>> svtNum = totalService.selectSvtCount(param);
        List<Map<String,Object>> hcNum = totalService.selectHcCount(param);
        List<Map<String,Object>> strayNum = totalService.selectStrayCount(param);
        List<Map<String,Object>> catNum = totalService.selectCatCount(param);
        List<Integer> rtuStatusList = totalService.selectRTUStatusBySiteId(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("rtuStatusList",rtuStatusList);
        resultMap.put("deviceWarningCount",deviceWarning.size());
        resultMap.put("rtuNum",rtuNum);
        resultMap.put("rtuOffNum",rtuOffNum.size());
        resultMap.put("rtuWarningNum",rtuWarningNum.size());
        resultMap.put("deviceNum",spdNum.size()+etcrNum.size()+lightningNum.size()+staticNum.size()+rswsNum.size()+svtNum.size()+hcNum.size()+strayNum.size()+catNum.size());
        return resultMap;
    }

    @RequestMapping(value = "/selectForFeignRTU",method = RequestMethod.GET)
    public Map<String,Object> selectForFeignRTU(HttpServletRequest req){
        String rtuId = req.getParameter("rtu_id");
        String siteId = req.getParameter("site_id");
        Map<String,Object> param = new HashMap<>();
        if(rtuId != null && !"".equals(rtuId)){
            int rtu_id = Integer.parseInt(rtuId);
            param.put("rtu_id",rtu_id);
            param.put("site_id","");
        }else if(siteId != null && !"".equals(siteId)){
            int site_id = Integer.parseInt(siteId);
            param.put("rtu_id","");
            param.put("site_id",site_id);
        }else{
            param.put("rtu_id","");
            param.put("site_id","");
        }
        System.out.println("param : "+param);
        //List<Map<String,Object>> deviceOff = totalService.selectDeviceOff(param);
        List<Map<String,Object>> deviceWarning = totalService.selectDeviceWarning(param);
        int rtuNum = totalService.selectRTUNumBySiteId(param);
        List<Map<String,Object>> rtuOffNum = totalService.selectRTUOff(param);
        List<Map<String,Object>> rtuWarningNum = totalService.selectRTUWarning(param);
        List<Map<String,Object>> spdNum = totalService.selectSPDCount(param);
        List<Map<String,Object>> etcrNum = totalService.selectETCRCount(param);
        List<Map<String,Object>> lightningNum = totalService.selectLightningCount(param);
        List<Map<String,Object>> staticNum = totalService.selectStaticCount(param);
        List<Map<String,Object>> rswsNum = totalService.selectRswsCount(param);
        List<Map<String,Object>> svtNum = totalService.selectSvtCount(param);
        List<Map<String,Object>> hcNum = totalService.selectHcCount(param);
        List<Map<String,Object>> strayNum = totalService.selectStrayCount(param);
        List<Map<String,Object>> catNum = totalService.selectCatCount(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("deviceWarningCount",deviceWarning.size());
        resultMap.put("rtuNum",rtuNum);
        resultMap.put("rtuOffNum",rtuOffNum.size());
        resultMap.put("rtuWarningNum",rtuWarningNum.size());
        resultMap.put("deviceNum",spdNum.size()+etcrNum.size()+lightningNum.size()+staticNum.size()+rswsNum.size()+svtNum.size()+hcNum.size()+strayNum.size()+catNum.size());
        return resultMap;
    }


    @RequestMapping(value = "/selectHistoryValue",method = RequestMethod.GET)
    public Map<String,Object> selectHistoryValue(HttpServletRequest req){
        String rtu_id = req.getParameter("rtu_id");
        String site_id = req.getParameter("site_id");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        String deviceId = req.getParameter("deviceId");
        int deviceType = Integer.parseInt(req.getParameter("deviceType"));
        Map<String,Object> param = new HashMap<>();
        param.put("rtu_id",rtu_id);
        param.put("site_id",site_id);
        param.put("startTime",startTime);
        param.put("endTime",endTime);
        Map<String,Object> resultMap = new HashMap<>();
        if(deviceType == 1){
            param.put("spd_number",deviceId);
            List<Map<String,Object>> list = totalService.selectSPDHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 2){
            param.put("rst_id",deviceId);
            List<Map<String,Object>> list = totalService.selectETCRHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 3){
            param.put("ltn_id",deviceId);
            List<Map<String,Object>> list = totalService.selectLightningHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 4){
            param.put("staet_id",deviceId);
            List<Map<String,Object>> list = totalService.selectStaticHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 5){
            param.put("hmt_id",deviceId);
            List<Map<String,Object>> list = totalService.selectRswsHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 6){
            param.put("tilt_id",deviceId);
            List<Map<String,Object>> list = totalService.selectSvtHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 7){
            param.put("es_id",deviceId);
            List<Map<String,Object>> list = totalService.selectHcHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 8){
            param.put("stret_id",deviceId);
            List<Map<String,Object>> list = totalService.selectStrayHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }else if(deviceType == 9){
            param.put("cathode_id",deviceId);
            List<Map<String,Object>> list = totalService.selectCatHistory(param);
            resultMap.put("items",list);
            return resultMap;
        }
        return null;

    }

    @RequestMapping(value = "/selectIndexData",method = RequestMethod.GET)
    public Map<String,Object> selectIndexData(HttpServletRequest req){
        Map<String,Object> param = new HashMap<>();
        param.put("rtu_id","");
        param.put("site_id","");
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);
        int siteNum = totalService.selectSiteTotal(param);
        int rtuNum = totalService.selectRTUTotal(param);
        int spdNum = totalService.selectSPDTotal(param);
        int etcrNum = totalService.selectETCRTotal(param);
        int lightningNum = totalService.selectLightningTotal(param);
        int staticNum = totalService.selectStaticTotal(param);
        int rswsNum = totalService.selectRswsTotal(param);
        int svtNum = totalService.selectSvtTotal(param);
        int hcNum = totalService.selectHcTotal(param);
        int strayNum = totalService.selectStrayTotal(param);
        int catNum = totalService.selectCatTotal(param);
        int deviceTotalNum = spdNum+etcrNum+lightningNum+staticNum+rswsNum+svtNum+hcNum+strayNum+catNum;

        List<Map<String,Object>> rtuWarningNum = totalService.selectRTUWarning(param);
        List<Map<String,Object>> siteWarningTop5 = totalService.selectSiteWarningTotal(param);
        List<Map<String,Object>> siteDeviceOffTop5 = totalService.selectSiteDeviceOffTotal(param);
        List<Map<String,Object>> siteOff = totalService.selectSiteOffTotal(param);
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("siteWarningTop5",siteWarningTop5);
        resultMap.put("siteDeviceOffTop5",siteDeviceOffTop5);
        resultMap.put("siteOff",siteOff);
        resultMap.put("siteNum",siteNum);
        resultMap.put("rtuNum",rtuNum);
        resultMap.put("deviceTotalNum",deviceTotalNum);
        resultMap.put("rtuWarningNum",rtuWarningNum.size());
        resultMap.put("num",ScheduledService.getNowDataList());
        return resultMap;
    }

    @RequestMapping(value = "/getWeChatInfo",method = RequestMethod.GET)
    public Map<String,Object> getWeChatInfo(){
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("click",feignForWeChat.dayClickNum().get("click"));
        resultMap.put("user",feignForWeChat.getUserList().get("user"));
        return resultMap;
    }

    @RequestMapping(value = "/deviceTotalByProvince",method = RequestMethod.GET)
    public List<Map<String,Object>> deviceTotalByProvince(HttpServletRequest req){
        List<Map<String,Object>> resultList = new LinkedList<>();
        Map<String,Object> paramMap = new HashMap<>();
        paramMap.put("rtu_id","");
        paramMap.put("site_id","");

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        paramMap.put("strList",strList);

        List<Map<String,Object>> siteInfoList = totalService.selectSiteById(paramMap);
        for(int i=0;i<siteInfoList.size();i++){
            int site_id = Integer.parseInt(siteInfoList.get(i).get("site_id")+"");
            Map<String,Object> param = new HashMap<>();
            param.put("rtu_id","");
            param.put("site_id",site_id);
            param.put("strList",strList);

            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("province",siteInfoList.get(i).get("site_province"));
            resultMap.put("spdNum",totalService.selectSPDCount(param).size());
            resultMap.put("etcrNum",totalService.selectETCRCount(param).size());
            resultMap.put("lightningNum",totalService.selectLightningCount(param).size());
            resultMap.put("staticNum",totalService.selectStaticCount(param).size());
            resultMap.put("rswsNum",totalService.selectRswsCount(param).size());
            resultMap.put("svtNum",totalService.selectSvtCount(param).size());
            resultMap.put("hcNum",totalService.selectHcCount(param).size());
            resultMap.put("strayNum",totalService.selectStrayCount(param).size());
            resultMap.put("catNum",totalService.selectCatCount(param).size());

            resultList.add(resultMap);
        }

        List<Map<String,Object>> finalList = new LinkedList<>();

        List<String> provinceList = Arrays.asList("北京市","天津市","河北省",
                "山西省","内蒙古自治区","辽宁省","吉林省",
                "黑龙江省","上海市","江苏省","浙江省",
                "安徽省","福建省","江西省","山东省","河南省",
                "湖北省","湖南省","广东省","广西壮族自治区",
                "海南省","重庆市","四川省","贵州省","云南省",
                "西藏自治区","陕西省","甘肃省","青海省",
                "宁夏回族自治区","新疆维吾尔自治区","台湾省","香港特别行政区","澳门特别行政区");
        for(int i=0;i<provinceList.size();i++){
            Map<String,Object> finalMap = new HashMap<>();
            finalMap.put("province",provinceList.get(i));
            finalMap.put("spdNum",0);
            finalMap.put("etcrNum",0);
            finalMap.put("lightningNum",0);
            finalMap.put("staticNum",0);
            finalMap.put("rswsNum",0);
            finalMap.put("svtNum",0);
            finalMap.put("hcNum",0);
            finalMap.put("strayNum",0);
            finalMap.put("catNum",0);
            for(int j=0;j<resultList.size();j++){
                if(provinceList.get(i).equals(resultList.get(j).get("province")+"")){
                    int spdOld = Integer.parseInt(finalMap.get("spdNum")+"");
                    int spdAdd = Integer.parseInt(resultList.get(j).get("spdNum")+"");
                    finalMap.put("spdNum",spdOld+spdAdd);
                    int etcrOld = Integer.parseInt(finalMap.get("etcrNum")+"");
                    int etcrAdd = Integer.parseInt(resultList.get(j).get("etcrNum")+"");
                    finalMap.put("etcrNum",etcrOld+etcrAdd);
                    int lightningOld = Integer.parseInt(finalMap.get("lightningNum")+"");
                    int lightningAdd = Integer.parseInt(resultList.get(j).get("lightningNum")+"");
                    finalMap.put("lightningNum",lightningOld+lightningAdd);
                    int staticOld = Integer.parseInt(finalMap.get("staticNum")+"");
                    int staticAdd = Integer.parseInt(resultList.get(j).get("staticNum")+"");
                    finalMap.put("staticNum",staticOld+staticAdd);
                    int rswsOld = Integer.parseInt(finalMap.get("rswsNum")+"");
                    int rswsAdd = Integer.parseInt(resultList.get(j).get("rswsNum")+"");
                    finalMap.put("rswsNum",rswsOld+rswsAdd);
                    int svtOld = Integer.parseInt(finalMap.get("svtNum")+"");
                    int svtAdd = Integer.parseInt(resultList.get(j).get("svtNum")+"");
                    finalMap.put("svtNum",svtOld+svtAdd);
                    int hcOld = Integer.parseInt(finalMap.get("hcNum")+"");
                    int hcAdd = Integer.parseInt(resultList.get(j).get("hcNum")+"");
                    finalMap.put("hcNum",hcOld+hcAdd);
                    int strayOld = Integer.parseInt(finalMap.get("strayNum")+"");
                    int strayAdd = Integer.parseInt(resultList.get(j).get("strayNum")+"");
                    finalMap.put("strayNum",strayOld+strayAdd);
                    int catOld = Integer.parseInt(finalMap.get("catNum")+"");
                    int catAdd = Integer.parseInt(resultList.get(j).get("catNum")+"");
                    finalMap.put("catNum",catOld+catAdd);
                }
            }

            finalList.add(finalMap);
        }
        return finalList;
    }


}
