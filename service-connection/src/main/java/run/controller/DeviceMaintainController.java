package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import run.bean.DeviceMaintain;
import run.service.DeviceMaintainService;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class DeviceMaintainController {
    @Autowired
    private DeviceMaintainService deviceMaintainService;
    @Autowired
    private StructureController structureController;

    @RequestMapping(value = "/selectAllDeviceMaintain",method = RequestMethod.GET)
    public Map<String,Object> selectAllDeviceMaintain (HttpServletRequest req, HttpServletResponse resp) {
        int start;
        if (req.getParameter("start") != null) {
            start = Integer.parseInt(req.getParameter("start"));
        } else {
            start = -1;
        }
        int limit;
        if (req.getParameter("limit") != null) {
            limit = Integer.parseInt(req.getParameter("limit"));
        } else {
            limit = -1;
        }
        int site_id;
        if (req.getParameter("site_id") != null && req.getParameter("site_id") != "") {
            site_id = Integer.parseInt(req.getParameter("site_id"));
        } else {
            site_id = -1;
        }
        int rtu_id;
        if (req.getParameter("rtu_id") != null && req.getParameter("rtu_id") != "") {
            rtu_id = Integer.parseInt(req.getParameter("rtu_id"));
        } else {
            rtu_id = -1;
        }
        int deviceType;
        if (req.getParameter("deviceType") != null && req.getParameter("deviceType") != "") {
            deviceType = Integer.parseInt(req.getParameter("deviceType"));
            if(deviceType == 0){
                deviceType = -1;
            }
        } else {
            deviceType = -1;
        }
        String reason = req.getParameter("reason");
        String content = req.getParameter("content");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        Map<String, Object> param = new HashMap<>();
        param.put("start", start);
        param.put("limit", limit);
        param.put("site_id", site_id);
        param.put("rtu_id", rtu_id);
        param.put("deviceType", deviceType);
        param.put("reason", reason);
        param.put("content", content);
        param.put("startTime", startTime);
        param.put("endTime", endTime);

        String structure = req.getParameter("structure");
        List<Integer> strList = structureController.foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList", strList);

        List<Map<String, Object>> deviceMaintainList = deviceMaintainService.selectAllDeviceMaintain(param);
        int count = deviceMaintainService.selectAllDeviceMaintainCount(param);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("items", deviceMaintainList);
        resultMap.put("totals", count);
        return resultMap;
    }

    @RequestMapping(value = "/insertDeviceMaintain", method = RequestMethod.POST)
    public Map<String, Object> insertDeviceMaintain (@RequestBody DeviceMaintain deviceMaintain){
        int result = deviceMaintainService.insertDeviceMaintain(deviceMaintain);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了设备维护记录");
        }else {
            map.put("success",false);
            map.put("message","添加失败");
        }
        return map;
    }

    @RequestMapping("/deleteDeviceMaintain")
    public Map<String, Object> deleteDeviceMaintain(HttpServletRequest req, HttpServletResponse resp){
        int id = Integer.parseInt(req.getParameter("id"));
        int res = deviceMaintainService.deleteDeviceMaintain(id);
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了该设备维护记录");
        }else {
            map.put("success",false);
            map.put("message","删除失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateDeviceMaintain", method = RequestMethod.POST)
    public Map<String, Object> updateDeviceMaintain(@RequestBody DeviceMaintain deviceMaintain){
        int result = deviceMaintainService.updateDeviceMaintain(deviceMaintain);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了该设备维护记录");
        }else {
            map.put("success",false);
            map.put("message","更新失败");
        }
        return map;
    }

}
