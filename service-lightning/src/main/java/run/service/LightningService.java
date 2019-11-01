package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Lightning;
import run.mapper.LightningMapper;

import java.util.List;
import java.util.Map;

@Service
public class LightningService {
    @Autowired
    LightningMapper lightningMapper;

    public List<Map<String,Object>> selectAllLightning(Map<String,Object> param){
        return lightningMapper.selectAllLightning(param);
    }

    public int selectAllLightningCount(Map<String,Object> param){
        return lightningMapper.selectAllLightningCount(param);
    }


    public int insertLightning(Lightning lightning){
        return lightningMapper.insertLightning(lightning);
    }

    public int updateLightning(Lightning lightning){
        return lightningMapper.updateLightning(lightning);
    }

    public Lightning selectOneLight(Map<String,Object> param){
        return lightningMapper.selectOneLight(param);
    }

    public int deleteLightningBySite(int id){
        return lightningMapper.deleteLightningBySite(id);
    }

    public int deleteLightningByRTU(int id){
        return lightningMapper.deleteLightningByRTU(id);
    }

    public int deleteLightning(Map<String,Object> param){
        return lightningMapper.deleteLightning(param);
    }

    public List<Map<String,Object>> selectLightningHistory(Map<String,Object> param){
        return lightningMapper.selectLightningHistory(param);
    }

    public List<Map<String,Object>> exportLightningHistory(Map<String,Object> param){
        return lightningMapper.exportLightningHistory(param);
    }

    public int selectLightningHistoryCount(Map<String,Object> param){
        return lightningMapper.selectLightningHistoryCount(param);
    }

    public List<Map<String,Object>> selectLightningByRTU(int rtu_id){
        return lightningMapper.selectLightningByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return lightningMapper.deleteRTUAlarmData(param);
    }
}
