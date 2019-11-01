package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Static;
import run.mapper.StaticMapper;

import java.util.List;
import java.util.Map;

@Service
public class StaticService {
    @Autowired
    StaticMapper StaticMapper;

    public List<Map<String,Object>> selectAllStatic(Map<String,Object> param){
        return StaticMapper.selectAllStatic(param);
    }

    public int selectAllStaticCount(Map<String,Object> param){
        return StaticMapper.selectAllStaticCount(param);
    }


    public int insertStatic(Static Static){
        return StaticMapper.insertStatic(Static);
    }

    public int updateStatic(Static Static){
        return StaticMapper.updateStatic(Static);
    }

    public Static selectOneLight(Map<String,Object> param){
        return StaticMapper.selectOneStatic(param);
    }

    public int deleteStaticBySite(int id){
        return StaticMapper.deleteStaticBySite(id);
    }

    public int deleteStaticByRTU(int id){
        return StaticMapper.deleteStaticByRTU(id);
    }

    public int deleteStatic(Map<String,Object> param){
        return StaticMapper.deleteStatic(param);
    }

    public List<Map<String,Object>> selectStaticHistory(Map<String,Object> param){
        return StaticMapper.selectStaticHistory(param);
    }

    public List<Map<String,Object>> exportStaticHistory(Map<String,Object> param){
        return StaticMapper.exportStaticHistory(param);
    }

    public int selectStaticHistoryCount(Map<String,Object> param){
        return StaticMapper.selectStaticHistoryCount(param);
    }

    public List<Map<String,Object>> selectStaticByRTU(int rtu_id){
        return StaticMapper.selectStaticByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return StaticMapper.deleteRTUAlarmData(param);
    }
}
