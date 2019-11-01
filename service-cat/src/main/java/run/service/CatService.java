package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Cat;
import run.mapper.CatMapper;

import java.util.List;
import java.util.Map;

@Service
public class CatService {
    @Autowired
    CatMapper catMapper;

    public List<Map<String,Object>> selectAllCat(Map<String,Object> param){
        return catMapper.selectAllCat(param);
    }

    public int selectAllCatCount(Map<String,Object> param){
        return catMapper.selectAllCatCount(param);
    }


    public int insertCat(Cat Cat){
        return catMapper.insertCat(Cat);
    }

    public int updateCat(Cat Cat){
        return catMapper.updateCat(Cat);
    }

    public Cat selectOneLight(Map<String,Object> param){
        return catMapper.selectOneCat(param);
    }

    public int deleteCatBySite(int id){
        return catMapper.deleteCatBySite(id);
    }

    public int deleteCatByRTU(int id){
        return catMapper.deleteCatByRTU(id);
    }

    public int deleteCat(Map<String,Object> param){
        return catMapper.deleteCat(param);
    }

    public List<Map<String,Object>> selectCatHistory(Map<String,Object> param){
        return catMapper.selectCatHistory(param);
    }

    public List<Map<String,Object>> exportCatHistory(Map<String,Object> param){
        return catMapper.exportCatHistory(param);
    }

    public int selectCatHistoryCount(Map<String,Object> param){
        return catMapper.selectCatHistoryCount(param);
    }

    public List<Map<String,Object>> selectCatByRTU(int rtu_id){
        return catMapper.selectCatByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return catMapper.deleteRTUAlarmData(param);
    }
}
