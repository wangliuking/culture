package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Hc;
import run.mapper.HcMapper;

import java.util.List;
import java.util.Map;

@Service
public class HcService {
    @Autowired
    HcMapper hcMapper;

    public List<Map<String,Object>> selectAllHc(Map<String,Object> param){
        return hcMapper.selectAllHc(param);
    }

    public int selectAllHcCount(Map<String,Object> param){
        return hcMapper.selectAllHcCount(param);
    }


    public int insertHc(Hc Hc){
        return hcMapper.insertHc(Hc);
    }

    public int updateHc(Hc Hc){
        return hcMapper.updateHc(Hc);
    }

    public Hc selectOneLight(Map<String,Object> param){
        return hcMapper.selectOneHc(param);
    }

    public int deleteHcBySite(int id){
        return hcMapper.deleteHcBySite(id);
    }

    public int deleteHcByRTU(int id){
        return hcMapper.deleteHcByRTU(id);
    }

    public int deleteHc(Map<String,Object> param){
        return hcMapper.deleteHc(param);
    }

    public List<Map<String,Object>> selectHcHistory(Map<String,Object> param){
        return hcMapper.selectHcHistory(param);
    }

    public List<Map<String,Object>> exportHcHistory(Map<String,Object> param){
        return hcMapper.exportHcHistory(param);
    }

    public int selectHcHistoryCount(Map<String,Object> param){
        return hcMapper.selectHcHistoryCount(param);
    }

    public List<Map<String,Object>> selectHcByRTU(int rtu_id){
        return hcMapper.selectHcByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return hcMapper.deleteRTUAlarmData(param);
    }
}
