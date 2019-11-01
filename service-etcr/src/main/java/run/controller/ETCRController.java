package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import run.bean.ETCR;
import run.bean.RTU;
import run.service.ETCRService;
import run.util.ExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ETCRController {
    @Autowired
    private ETCRService ETCRService;
    @Autowired
    private FeignForMQ feignForMQ;
    @Autowired
    private FeignForRTU feignForRTU;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllETCR",method = RequestMethod.GET)
    public Map<String,Object> selectAllETCR (HttpServletRequest req, HttpServletResponse resp){
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
        List<Map<String,Object>> ETCRList = ETCRService.selectAllETCR(param);
        int count = ETCRService.selectAllETCRCount(param);
        Map<String,Object> ETCRListMap = new HashMap<>();
        ETCRListMap.put("items",ETCRList);
        ETCRListMap.put("totals",count);
        return ETCRListMap;

    }


    @RequestMapping(value = "/selectAllRelayno",method = RequestMethod.GET)
    public Map<String,Object> selectAllRelayno (HttpServletRequest req, HttpServletResponse resp){
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

        System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id);
        List<Map<String,Object>> relaynoList = ETCRService.selectAllRelayno(start,limit,site_id,rtu_id);
        int count = ETCRService.selectAllRelaynoCount(start,limit,site_id,rtu_id);
        Map<String,Object> relaynoListMap = new HashMap<>();
        relaynoListMap.put("items",relaynoList);
        relaynoListMap.put("totals",count);
        return relaynoListMap;

    }

    @RequestMapping(value = "/selectByETCR",method = RequestMethod.GET)
    public String selectByETCR (HttpServletRequest req, HttpServletResponse resp){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int ETCR_number = Integer.parseInt(req.getParameter("ETCR_number"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        Map<String,Object> param = new HashMap<>();
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);
        param.put("rst_id",ETCR_number);
        param.put("rtu_port",rtu_port);
        return ETCRService.selectByETCR(param).toString();
    }

    public static void main(String[] args) {
        int i = Integer.parseInt("000000000000",2);
        System.out.println(i);
    }

    @RequestMapping(value = "/insertETCR", method = RequestMethod.POST)
    public Map<String, Object> insertETCR (@RequestBody ETCR ETCR){
        System.out.println("进入添加方法！！！");
        int rst_id = ETCR.getRst_id();
        RTU rtu = feignForRTU.selectRTUById(ETCR.getRtu_id());
        System.out.println(ETCR);
        if(ETCR.getRst_type() == 1){
            StringBuilder str = new StringBuilder("000000000000");
            if(!"".equals(ETCR.getRelayno_name1())){
                str.replace(3,4,"1");
            }
            if(!"".equals(ETCR.getRelayno_name2())) {
                str.replace(2, 3, "1");
            }
            if(!"".equals(ETCR.getRelayno_name3())) {
                str.replace(1, 2, "1");
            }
            if(!"".equals(ETCR.getRelayno_name4())) {
                str.replace(0, 1, "1");
            }
            int rel = Integer.parseInt(str.toString(),2);
            ETCR.setRst_id(rel+ETCR.getRst_id());
            ETCR.setRst_type(0);
            Map<String,Object> tempParams = new HashMap<>();
            tempParams.put("rtu",rtu);
            if(rel == 0){
                //继电器为零的情况(走正常485流程)
                tempParams.put("etcr",ETCR);
                tempParams.put("op",0);
            }else{
                //继电器不为零的情况(变更操作码为8)
                tempParams.put("etcr",ETCR);
                tempParams.put("op",8);
            }
            String res = feignForMQ.sendETCRConfForRTU(tempParams);
            Map<String,Object> map = new HashMap<>();
            if("配置成功".equals(res)){
                ETCR.setRst_type(1);
                if(rel == 0){
                    //继电器为零的情况
                    ETCR.setRelayno(0);
                    ETCR.setRst_id(rst_id);
                    ETCRService.insertETCR(ETCR);
                    Map<String,Object> params = new HashMap<>();
                    params.put("rtu",rtu);
                    params.put("etcr",ETCR);
                    params.put("op",0);
                    feignForMQ.sendETCRConf(params);
                }else{
                    if(!"".equals(ETCR.getRelayno_name1())){
                        ETCR.setRelayno(ETCR.getRelayno1());
                        ETCR.setRelayno_name(ETCR.getRelayno_name1());
                        ETCR.setRst_line_long(ETCR.getRst_line_long1());
                        ETCR.setRst_line_radius(ETCR.getRst_line_radius1());
                        ETCR.setRst_id(rst_id);
                        ETCRService.insertETCR(ETCR);

                        Map<String,Object> params = new HashMap<>();
                        params.put("rtu",rtu);
                        params.put("etcr",ETCR);
                        params.put("op",0);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(ETCR.getRelayno_name2())){
                        ETCR.setRelayno(ETCR.getRelayno2());
                        ETCR.setRelayno_name(ETCR.getRelayno_name2());
                        ETCR.setRst_line_long(ETCR.getRst_line_long2());
                        ETCR.setRst_line_radius(ETCR.getRst_line_radius2());
                        ETCR.setRst_id(rst_id);
                        ETCRService.insertETCR(ETCR);

                        Map<String,Object> params = new HashMap<>();
                        params.put("rtu",rtu);
                        params.put("etcr",ETCR);
                        params.put("op",0);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(ETCR.getRelayno_name3())){
                        ETCR.setRelayno(ETCR.getRelayno3());
                        ETCR.setRelayno_name(ETCR.getRelayno_name3());
                        ETCR.setRst_line_long(ETCR.getRst_line_long3());
                        ETCR.setRst_line_radius(ETCR.getRst_line_radius3());
                        ETCR.setRst_id(rst_id);
                        ETCRService.insertETCR(ETCR);

                        Map<String,Object> params = new HashMap<>();
                        params.put("rtu",rtu);
                        params.put("etcr",ETCR);
                        params.put("op",0);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(ETCR.getRelayno_name4())){
                        ETCR.setRelayno(ETCR.getRelayno4());
                        ETCR.setRelayno_name(ETCR.getRelayno_name4());
                        ETCR.setRst_line_long(ETCR.getRst_line_long4());
                        ETCR.setRst_line_radius(ETCR.getRst_line_radius4());
                        ETCR.setRst_id(rst_id);
                        ETCRService.insertETCR(ETCR);

                        Map<String,Object> params = new HashMap<>();
                        params.put("rtu",rtu);
                        params.put("etcr",ETCR);
                        params.put("op",0);
                        feignForMQ.sendETCRConf(params);
                    }
                }
                map.put("success",true);
                map.put("message",res);
                return map;
            }else{
                map.put("success",false);
                map.put("message",res);
                return map;
            }

        }else if(ETCR.getRst_type() == 2){
            ETCR.setRst_type(1);
            Map<String,Object> params = new HashMap<>();
            params.put("rtu",rtu);
            params.put("etcr",ETCR);
            params.put("op",0);
            String res = feignForMQ.sendETCRConfForRTU(params);
            Map<String,Object> map = new HashMap<>();
            if("配置成功".equals(res)){
                ETCR.setRst_type(2);
                ETCRService.insertETCR(ETCR);
                feignForMQ.sendETCRBConf(params);
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

    @RequestMapping(value = "/updateETCR", method = RequestMethod.POST)
    public Map<String, Object> updateETCR(@RequestBody ETCR etcr){
        int rst_id = etcr.getRst_id();
        RTU rtu = feignForRTU.selectRTUById(etcr.getRtu_id());
        Map<String,Object> params = new HashMap<>();
        if (etcr.getRst_type() == 1) {
            StringBuilder str = new StringBuilder("000000000000");
            if(!"".equals(etcr.getRelayno_name1())){
                str.replace(3,4,"1");
            }
            if(!"".equals(etcr.getRelayno_name2())) {
                str.replace(2, 3, "1");
            }
            if(!"".equals(etcr.getRelayno_name3())) {
                str.replace(1, 2, "1");
            }
            if(!"".equals(etcr.getRelayno_name4())) {
                str.replace(0, 1, "1");
            }
            int rel = Integer.parseInt(str.toString(),2);
            etcr.setRst_id(rel+etcr.getRst_id());
            etcr.setRst_type(0);
            Map<String,Object> tempParams = new HashMap<>();
            tempParams.put("rtu",rtu);
            if(rel == 0){
                //继电器为零的情况(走正常485流程)
                tempParams.put("etcr",etcr);
                tempParams.put("op",0);
            }else{
                //继电器不为零的情况(变更操作码为8)
                tempParams.put("etcr",etcr);
                tempParams.put("op",8);
            }
            String res = feignForMQ.sendETCRConfForRTU(tempParams);
            Map<String,Object> map = new HashMap<>();
            if("配置成功".equals(res)){
                etcr.setRst_type(1);
                if(rel == 0) {
                    //继电器为零的情况
                    etcr.setRelayno(0);
                    etcr.setRst_id(rst_id);
                    ETCRService.updateETCR(etcr);
                    params.put("rtu", rtu);
                    params.put("etcr", etcr);
                    params.put("op", 0);
                    feignForMQ.sendETCRConf(params);
                }else{
                    if(!"".equals(etcr.getRelayno_name1())){
                        etcr.setRelayno(etcr.getRelayno1());
                        etcr.setRelayno_name(etcr.getRelayno_name1());
                        etcr.setRst_line_long(etcr.getRst_line_long1());
                        etcr.setRst_line_radius(etcr.getRst_line_radius1());
                        etcr.setRst_id(rst_id);
                        ETCRService.updateETCR(etcr);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 0);
                        feignForMQ.sendETCRConf(params);
                    }else{
                        Map<String,Object> etcrParam = new HashMap<>();
                        etcrParam.put("rtu_id",rtu.getRtu_id());
                        etcrParam.put("rst_id",rst_id);
                        etcrParam.put("rtu_port",etcr.getRtu_port());
                        etcrParam.put("relayno",1);
                        ETCRService.deleteETCRByRelayno(etcrParam);
                        ETCRService.deleteETCRNowByRelayno(etcrParam);
                        etcr.setRelayno(etcr.getRelayno1());
                        etcr.setRelayno_name(etcr.getRelayno_name1());
                        etcr.setRst_line_long(etcr.getRst_line_long1());
                        etcr.setRst_line_radius(etcr.getRst_line_radius1());
                        etcr.setRst_id(rst_id);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 1);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(etcr.getRelayno_name2())){
                        etcr.setRelayno(etcr.getRelayno2());
                        etcr.setRelayno_name(etcr.getRelayno_name2());
                        etcr.setRst_line_long(etcr.getRst_line_long2());
                        etcr.setRst_line_radius(etcr.getRst_line_radius2());
                        etcr.setRst_id(rst_id);
                        ETCRService.updateETCR(etcr);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 0);
                        feignForMQ.sendETCRConf(params);
                    }else{
                        Map<String,Object> etcrParam = new HashMap<>();
                        etcrParam.put("rtu_id",rtu.getRtu_id());
                        etcrParam.put("rst_id",rst_id);
                        etcrParam.put("rtu_port",etcr.getRtu_port());
                        etcrParam.put("relayno",2);
                        ETCRService.deleteETCRByRelayno(etcrParam);
                        ETCRService.deleteETCRNowByRelayno(etcrParam);
                        etcr.setRelayno(etcr.getRelayno2());
                        etcr.setRelayno_name(etcr.getRelayno_name2());
                        etcr.setRst_line_long(etcr.getRst_line_long2());
                        etcr.setRst_line_radius(etcr.getRst_line_radius2());
                        etcr.setRst_id(rst_id);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 1);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(etcr.getRelayno_name3())){
                        etcr.setRelayno(etcr.getRelayno3());
                        etcr.setRelayno_name(etcr.getRelayno_name3());
                        etcr.setRst_line_long(etcr.getRst_line_long3());
                        etcr.setRst_line_radius(etcr.getRst_line_radius3());
                        etcr.setRst_id(rst_id);
                        ETCRService.updateETCR(etcr);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 0);
                        feignForMQ.sendETCRConf(params);
                    }else{
                        Map<String,Object> etcrParam = new HashMap<>();
                        etcrParam.put("rtu_id",rtu.getRtu_id());
                        etcrParam.put("rst_id",rst_id);
                        etcrParam.put("rtu_port",etcr.getRtu_port());
                        etcrParam.put("relayno",3);
                        ETCRService.deleteETCRByRelayno(etcrParam);
                        ETCRService.deleteETCRNowByRelayno(etcrParam);
                        etcr.setRelayno(etcr.getRelayno3());
                        etcr.setRelayno_name(etcr.getRelayno_name3());
                        etcr.setRst_line_long(etcr.getRst_line_long3());
                        etcr.setRst_line_radius(etcr.getRst_line_radius3());
                        etcr.setRst_id(rst_id);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 1);
                        feignForMQ.sendETCRConf(params);
                    }
                    if(!"".equals(etcr.getRelayno_name4())){
                        etcr.setRelayno(etcr.getRelayno4());
                        etcr.setRelayno_name(etcr.getRelayno_name4());
                        etcr.setRst_line_long(etcr.getRst_line_long4());
                        etcr.setRst_line_radius(etcr.getRst_line_radius4());
                        etcr.setRst_id(rst_id);
                        ETCRService.updateETCR(etcr);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 0);
                        feignForMQ.sendETCRConf(params);
                    }else{
                        Map<String,Object> etcrParam = new HashMap<>();
                        etcrParam.put("rtu_id",rtu.getRtu_id());
                        etcrParam.put("rst_id",rst_id);
                        etcrParam.put("rtu_port",etcr.getRtu_port());
                        etcrParam.put("relayno",4);
                        ETCRService.deleteETCRByRelayno(etcrParam);
                        ETCRService.deleteETCRNowByRelayno(etcrParam);
                        etcr.setRelayno(etcr.getRelayno4());
                        etcr.setRelayno_name(etcr.getRelayno_name4());
                        etcr.setRst_line_long(etcr.getRst_line_long4());
                        etcr.setRst_line_radius(etcr.getRst_line_radius4());
                        etcr.setRst_id(rst_id);
                        params.put("rtu", rtu);
                        params.put("etcr", etcr);
                        params.put("op", 1);
                        feignForMQ.sendETCRConf(params);
                    }
                }
                map.put("success",true);
                map.put("message",res);
                return map;
            }else{
                map.put("success",false);
                map.put("message",res);
                return map;
            }

        } else if (etcr.getRst_type() == 2) {
            etcr.setRst_type(1);
            Map<String, Object> temp = new HashMap<>();
            temp.put("rtu", rtu);
            temp.put("etcr", etcr);
            temp.put("op", 0);
            String res = feignForMQ.sendETCRConfForRTU(temp);
            Map<String,Object> map = new HashMap<>();
            if("配置成功".equals(res)){
                etcr.setRst_type(2);
                ETCRService.updateETCR(etcr);
                feignForMQ.sendETCRBConf(temp);
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

    @RequestMapping(value = "/deleteETCR", method = RequestMethod.GET)
    public Map<String, Object> deleteETCR(HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int rst_id = Integer.parseInt(req.getParameter("rst_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        RTU rtu = feignForRTU.selectRTUById(rtu_id);

        Map<String,Object> params = new HashMap<>();
        params.put("rtu_id",rtu_id);
        params.put("rst_id",rst_id);
        params.put("rtu_port",rtu_port);

        List<ETCR> etcrList = ETCRService.selectETCRByRTUIdAndRSTId(params);

        System.out.println("etcrList长度为 ： "+etcrList.size());
        System.out.println("etcrList为 ： "+etcrList);
        if(etcrList.size()>0){
            ETCR etcr = etcrList.get(0);
            if(etcr.getRst_type() == 1){
                StringBuilder str = new StringBuilder("000000000000");
                for(int i=0;i<etcrList.size();i++){
                    ETCR tempEtcr = etcrList.get(i);
                    if(tempEtcr.getRelayno() == 1){
                        str.replace(3,4,"1");
                    }
                    if(tempEtcr.getRelayno() == 2) {
                        str.replace(2, 3, "1");
                    }
                    if(tempEtcr.getRelayno() == 3) {
                        str.replace(1, 2, "1");
                    }
                    if(tempEtcr.getRelayno() == 4) {
                        str.replace(0, 1, "1");
                    }

                }

                int rel = Integer.parseInt(str.toString(),2);
                etcr.setRst_id(rel+etcr.getRst_id());
                etcr.setRst_type(0);
                Map<String,Object> tempParams = new HashMap<>();
                tempParams.put("rtu",rtu);
                if(rel == 0){
                    //继电器为零的情况(走正常485流程)
                    tempParams.put("etcr",etcr);
                    tempParams.put("op",1);
                }else{
                    //继电器不为零的情况(变更操作码为8)
                    tempParams.put("etcr",etcr);
                    tempParams.put("op",8);
                }
                String res = feignForMQ.sendETCRConfForRTU(tempParams);
                Map<String,Object> map = new HashMap<>();
                if("配置成功".equals(res)){
                    //删除rtuAlarmData相关信息
                    ETCRService.deleteRTUAlarmData(params);
                    if(rel == 0) {
                        //继电器为零的情况
                        etcr.setRelayno(0);
                        ETCRService.deleteETCR(params);
                        etcr.setRst_id(rst_id);
                        Map<String, Object> temp = new HashMap<>();
                        temp.put("rtu", rtu);
                        temp.put("etcr", etcr);
                        temp.put("op", 1);
                        feignForMQ.sendETCRConf(temp);
                    }else{
                        ETCRService.deleteETCR(params);
                        etcr.setRst_id(rst_id);
                        for(int i=0;i<etcrList.size();i++){
                            Map<String, Object> temp = new HashMap<>();
                            temp.put("rtu", rtu);
                            temp.put("etcr", etcr);
                            temp.put("op", 1);
                            feignForMQ.sendETCRConf(temp);
                        }
                    }
                    map.put("success",true);
                    map.put("message",res);
                    return map;
                }else{
                    map.put("success",false);
                    map.put("message",res);
                    return map;
                }

            }else if(etcr.getRst_type() == 2){
                etcr.setRst_type(1);
                Map<String,Object> tempParams = new HashMap<>();
                tempParams.put("rtu",rtu);
                tempParams.put("etcr",etcr);
                tempParams.put("op",1);
                String res = feignForMQ.sendETCRConfForRTU(tempParams);
                Map<String,Object> map = new HashMap<>();
                if("配置成功".equals(res)){
                    //删除rtuAlarmData相关信息
                    ETCRService.deleteRTUAlarmData(params);

                    ETCRService.deleteETCR(params);
                    Map<String, Object> temp = new HashMap<>();
                    temp.put("rtu", rtu);
                    temp.put("etcr", etcr);
                    temp.put("op", 1);
                    feignForMQ.sendETCRBConf(temp);
                    map.put("success",true);
                    map.put("message",res);
                    return map;
                }else{
                    map.put("success",false);
                    map.put("message",res);
                    return map;
                }
            }

        }
        return null;
    }

    @RequestMapping(value = "/deleteETCRBySite", method = RequestMethod.GET)
    public void deleteETCRBySite(HttpServletRequest req){
        int site_id = Integer.parseInt(req.getParameter("site_id"));
        int res = ETCRService.deleteETCRBySite(site_id);
    }

    @RequestMapping(value = "/deleteETCRByRTU", method = RequestMethod.GET)
    public void deleteETCRByRTU(HttpServletRequest req){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int res = ETCRService.deleteETCRByRTU(rtu_id);
    }


    @RequestMapping(value = "/selectNowData",method = RequestMethod.GET)
    public Map<String,Object> selectNowData (HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int rst_id = Integer.parseInt(req.getParameter("rst_id"));
        int relayno = Integer.parseInt(req.getParameter("relayno"));
        int rtu_channel = Integer.parseInt(req.getParameter("rtu_channel"));
        Map<String,Object> param = new HashMap<>();
        param.put("rtu_id",rtu_id);
        param.put("rst_id",rst_id);
        param.put("relayno",relayno);
        param.put("rtu_channel",rtu_channel);
        Map<String,Object> map = ETCRService.selectNowData(param);
        Map<String,Object> ETCRListMap = new HashMap<>();
        ETCRListMap.put("items",map);
        return ETCRListMap;

    }

    @RequestMapping(value = "/selectETCRByRTUID4RSTID",method = RequestMethod.GET)
    public Map<String,Object> selectETCRByRTUID4RSTID (HttpServletRequest req, HttpServletResponse resp){
        int rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        int rst_id = Integer.parseInt(req.getParameter("rst_id"));
        int rtu_port = Integer.parseInt(req.getParameter("rtu_port"));
        Map<String,Object> param = new HashMap<>();
        param.put("rtu_id",rtu_id);
        param.put("rst_id",rst_id);
        param.put("rtu_port",rtu_port);
        List<ETCR> list = ETCRService.selectETCRByRTUID4RSTID(param);

        ETCR firstEtcr = list.get(0);
        firstEtcr.setRelayno1(firstEtcr.getRelayno());
        firstEtcr.setRelayno_name1(firstEtcr.getRelayno_name());
        firstEtcr.setRst_line_long1(firstEtcr.getRst_line_long());
        firstEtcr.setRst_line_radius1(firstEtcr.getRst_line_radius());

        if(list.size()>1){
            firstEtcr.setRelayno2(list.get(1).getRelayno());
            firstEtcr.setRelayno_name2(list.get(1).getRelayno_name());
            firstEtcr.setRst_line_long2(list.get(1).getRst_line_long());
            firstEtcr.setRst_line_radius2(list.get(1).getRst_line_radius());
        }

        if(list.size()>2){
            firstEtcr.setRelayno3(list.get(2).getRelayno());
            firstEtcr.setRelayno_name3(list.get(2).getRelayno_name());
            firstEtcr.setRst_line_long3(list.get(2).getRst_line_long());
            firstEtcr.setRst_line_radius3(list.get(2).getRst_line_radius());
        }

        if(list.size()>3){
            firstEtcr.setRelayno4(list.get(3).getRelayno());
            firstEtcr.setRelayno_name4(list.get(3).getRelayno_name());
            firstEtcr.setRst_line_long4(list.get(3).getRst_line_long());
            firstEtcr.setRst_line_radius4(list.get(3).getRst_line_radius());

        }

        Map<String,Object> ETCRListMap = new HashMap<>();
        ETCRListMap.put("items",firstEtcr);
        ETCRListMap.put("message","修改成功");
        return ETCRListMap;

    }

    @RequestMapping(value = "/selectAllETCRHistory",method = RequestMethod.GET)
    public Map<String,Object> selectAllETCRHistory (HttpServletRequest req, HttpServletResponse resp){
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
        int rst_id;
        if(req.getParameter("rst_id") != null && req.getParameter("rst_id") != ""){
            rst_id = Integer.parseInt(req.getParameter("rst_id"));
        }else {
            rst_id = -1;
        }
        String rst_location = req.getParameter("location");
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
        param.put("rst_id",rst_id);
        param.put("rst_location",rst_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        //System.out.println(start+"=="+limit+"=="+site_id+"=="+rtu_id+"=="+spd_number+"=="+spd_location);
        List<Map<String,Object>> etcrList = ETCRService.selectETCRHistory(param);
        int count = ETCRService.selectETCRHistoryCount(param);
        Map<String,Object> etcrListMap = new HashMap<>();
        etcrListMap.put("items",etcrList);
        etcrListMap.put("totals",count);
        return etcrListMap;

    }

    @RequestMapping(value = "/exportAllETCRHistoryExcel",method = RequestMethod.GET)
    public void exportAllETCRHistoryExcel (HttpServletRequest req, HttpServletResponse response){
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
        int rst_id;
        if(req.getParameter("rst_id") != null && req.getParameter("rst_id") != ""){
            rst_id = Integer.parseInt(req.getParameter("rst_id"));
        }else {
            rst_id = -1;
        }
        String rst_location = req.getParameter("location");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);
        param.put("site_id",site_id);
        param.put("rtu_id",rtu_id);
        param.put("rst_id",rst_id);
        param.put("rst_location",rst_location);
        param.put("startTime",startTime);
        param.put("endTime",endTime);
        List<Map<String,Object>> etcrList = ETCRService.exportAllETCRHistoryExcel(param);

        String sheetName = "测试";
        String fileName = "ETCRExcel";
        System.out.println("准备进行导出！！！");
        try {
            ExcelUtil.exportExcel(response, etcrList, sheetName, fileName, 15) ;
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/selectETCROneType",method = RequestMethod.GET)
    public List<ETCR> selectETCROneType(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        List<ETCR> finalList = new ArrayList<>();
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            List<Map<String,Object>> intList = ETCRService.selectETCROneTypeCount(rtu_id);
            if(intList != null){
                for(int i=0;i<intList.size();i++){
                    ETCR etcr = new ETCR();
                    int rst_id = Integer.parseInt(intList.get(i).get("rst_id").toString());
                    int rtu_channel = Integer.parseInt(intList.get(i).get("rtu_channel").toString());
                    etcr.setRtu_id(rtu_id);
                    etcr.setRst_id(rst_id);
                    Map<String,Object> param = new HashMap<>();
                    param.put("rtu_id",rtu_id);
                    param.put("rst_id",rst_id);
                    param.put("rtu_channel",rtu_channel);
                    List<Map<String,Object>> list = ETCRService.selectETCROneType(param);
                    for(int j=0;j<list.size();j++){
                        Map<String,Object> map = list.get(j);
                        etcr.setRst_location(map.get("rst_location")+"");
                        if(map.get("relayno") != null && Integer.parseInt(map.get("relayno").toString()) == 1){
                            etcr.setRtu_port(Integer.parseInt(map.get("rtu_channel").toString()));
                            etcr.setRelayno1(Integer.parseInt(map.get("relayno").toString()));
                            etcr.setRelayno_name1(map.get("rst_state").toString());
                            etcr.setRst_line_long1(map.get("rst_value").toString());
                            etcr.setRst_line_radius1(map.get("alarm").toString());
                            etcr.setRelayno_location1(map.get("relayno_name")+"");
                        }
                        if(map.get("relayno") != null && Integer.parseInt(map.get("relayno").toString()) == 2){
                            etcr.setRelayno2(Integer.parseInt(map.get("relayno").toString()));
                            etcr.setRelayno_name2(map.get("rst_state").toString());
                            etcr.setRst_line_long2(map.get("rst_value").toString());
                            etcr.setRst_line_radius2(map.get("alarm").toString());
                            etcr.setRelayno_location2(map.get("relayno_name")+"");
                        }
                        if(map.get("relayno") != null && Integer.parseInt(map.get("relayno").toString()) == 3){
                            etcr.setRelayno3(Integer.parseInt(map.get("relayno").toString()));
                            etcr.setRelayno_name3(map.get("rst_state").toString());
                            etcr.setRst_line_long3(map.get("rst_value").toString());
                            etcr.setRst_line_radius3(map.get("alarm").toString());
                            etcr.setRelayno_location3(map.get("relayno_name")+"");
                        }
                        if(map.get("relayno") != null && Integer.parseInt(map.get("relayno").toString()) == 4){
                            etcr.setRelayno4(Integer.parseInt(map.get("relayno").toString()));
                            etcr.setRelayno_name4(map.get("rst_state").toString());
                            etcr.setRst_line_long4(map.get("rst_value").toString());
                            etcr.setRst_line_radius4(map.get("alarm").toString());
                            etcr.setRelayno_location4(map.get("relayno_name")+"");
                        }
                    }
                    finalList.add(etcr);
                }
            }
        }
        return finalList;
    }

    @RequestMapping(value = "/selectETCRTwoType",method = RequestMethod.GET)
    public List<Map<String,Object>> selectETCRTwoType(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return ETCRService.selectETCRTwoType(rtu_id);
        }else{
            return null;
        }
    }

    @RequestMapping(value = "/selectETCRThreeType",method = RequestMethod.GET)
    public List<Map<String,Object>> selectETCRThreeType(HttpServletRequest req){
        String str = req.getParameter("rtu_id");
        if(str != null && !"".equals(str)){
            int rtu_id = Integer.parseInt(str);
            return ETCRService.selectETCRThreeType(rtu_id);
        }else{
            return null;
        }
    }

    @RequestMapping(value = "/selectETCRCountBySiteId",method = RequestMethod.GET)
    public int selectETCRCountBySiteId(HttpServletRequest req){
        String str = req.getParameter("site_id");
        int site_id = 0;
        if(str != null && !"".equals(str)){
            site_id = Integer.parseInt(str);
            return ETCRService.selectETCRCountBySiteId(site_id);
        }else{
            return 0;
        }
    }
}
