package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.DeviceMaintain;
import run.bean.RTU;
import run.mapper.DeviceMaintainMapper;
import run.mapper.RTUMapper;

import java.util.List;
import java.util.Map;

@Service
public class DeviceMaintainService {
    @Autowired
    DeviceMaintainMapper deviceMaintainMapper;

    public List<Map<String,Object>> selectAllDeviceMaintain(Map<String,Object> param){
        return deviceMaintainMapper.selectAllDeviceMaintain(param);
    }

    public int selectAllDeviceMaintainCount(Map<String,Object> param){
        return deviceMaintainMapper.selectAllDeviceMaintainCount(param);
    }


    public int insertDeviceMaintain(DeviceMaintain deviceMaintain){
        return deviceMaintainMapper.insertDeviceMaintain(deviceMaintain);
    }

    public int deleteDeviceMaintain(int id){
        return deviceMaintainMapper.deleteDeviceMaintain(id);
    }

    public int updateDeviceMaintain(DeviceMaintain deviceMaintain){
        return deviceMaintainMapper.updateDeviceMaintain(deviceMaintain);
    }
}
