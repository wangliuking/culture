package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Stray;
import run.mapper.StrayMapper;

import java.util.List;
import java.util.Map;

@Service
public class StrayService {
    @Autowired
    StrayMapper strayMapper;

    public List<Map<String,Object>> selectAllStray(Map<String,Object> param){
        return strayMapper.selectAllStray(param);
    }

    public int selectAllStrayCount(Map<String,Object> param){
        return strayMapper.selectAllStrayCount(param);
    }


    public int insertStray(Stray Stray){
        return strayMapper.insertStray(Stray);
    }

    public int updateStray(Stray Stray){
        return strayMapper.updateStray(Stray);
    }

    public List<Stray> selectStray(Map<String,Object> param){
        return strayMapper.selectStray(param);
    }

    public int deleteStrayBySite(int id){
        return strayMapper.deleteStrayBySite(id);
    }

    public int deleteStrayByRTU(int id){
        return strayMapper.deleteStrayByRTU(id);
    }

    public int deleteStray(Map<String,Object> param){
        return strayMapper.deleteStray(param);
    }

    public List<Map<String,Object>> selectStrayHistory(Map<String,Object> param){
        return strayMapper.selectStrayHistory(param);
    }

    public List<Map<String,Object>> exportStrayHistory(Map<String,Object> param){
        return strayMapper.exportStrayHistory(param);
    }

    public int selectStrayHistoryCount(Map<String,Object> param){
        return strayMapper.selectStrayHistoryCount(param);
    }

    public List<Map<String,Object>> selectStrayByRTU(int rtu_id){
        return strayMapper.selectStrayByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return strayMapper.deleteRTUAlarmData(param);
    }
}
