package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.RTU;
import run.mapper.RTUMapper;


import java.util.List;
import java.util.Map;

@Service
public class RTUService {
    @Autowired
    RTUMapper rtuMapper;

    public List<Map<String,Object>> selectAllRTU(Map<String,Object> param){
        return rtuMapper.selectAllRTU(param);
    }

    public int selectDeviceWarningCount(int rtu_id){
        return rtuMapper.selectDeviceWarningCount(rtu_id);
    }

    public Map<String,Object> selectRTUById(int id){
        return rtuMapper.selectRTUById(id);
    }

    public int selectRTUCountBySiteId(int id){
        return rtuMapper.selectRTUCountBySiteId(id);
    }

    public int insertRTU(RTU rtu){
        return rtuMapper.insertRTU(rtu);
    }

    public int deleteRTU(int id){
        return rtuMapper.deleteRTU(id);
    }

    public int deleteRTUBySite(int id){
        return rtuMapper.deleteRTUBySite(id);
    }

    public int updateRTU(RTU rtu){
        return rtuMapper.updateRTU(rtu);
    }

    public List<Map<String,Object>> selectAllRTUPosition(Map<String,Object> param){
        return rtuMapper.selectAllRTUPosition(param);
    }

    public int delSpd(int rtu_id){
        return rtuMapper.delSpd(rtu_id);
    }

    public int delEtcr(int rtu_id){
        return rtuMapper.delEtcr(rtu_id);
    }

    public int delLightning(int rtu_id){
        return rtuMapper.delLightning(rtu_id);
    }

    public int delStatic(int rtu_id){
        return rtuMapper.delStatic(rtu_id);
    }

    public int delRsws(int rtu_id){
        return rtuMapper.delRsws(rtu_id);
    }

    public int delSvt(int rtu_id){
        return rtuMapper.delSvt(rtu_id);
    }

    public int delHc(int rtu_id){
        return rtuMapper.delHc(rtu_id);
    }

    public int delStray(int rtu_id){
        return rtuMapper.delStray(rtu_id);
    }

    public int delCat(int rtu_id){
        return rtuMapper.delCat(rtu_id);
    }

    public int delAlarmNow(int rtu_id){
        return rtuMapper.delAlarmNow(rtu_id);
    }

    public int delAlarmHistory(int rtu_id){
        return rtuMapper.delAlarmHistory(rtu_id);
    }


}
