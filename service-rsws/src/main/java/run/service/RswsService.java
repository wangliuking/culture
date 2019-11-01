package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Rsws;
import run.mapper.RswsMapper;

import java.util.List;
import java.util.Map;

@Service
public class RswsService {
    @Autowired
    RswsMapper rswsMapper;

    public List<Map<String,Object>> selectAllRsws(Map<String,Object> param){
        return rswsMapper.selectAllRsws(param);
    }

    public int selectAllRswsCount(Map<String,Object> param){
        return rswsMapper.selectAllRswsCount(param);
    }


    public int insertRsws(Rsws rsws){
        return rswsMapper.insertRsws(rsws);
    }

    public int updateRsws(Rsws rsws){
        return rswsMapper.updateRsws(rsws);
    }

    public Rsws selectOneLight(Map<String,Object> param){
        return rswsMapper.selectOneRsws(param);
    }

    public int deleteRswsBySite(int id){
        return rswsMapper.deleteRswsBySite(id);
    }

    public int deleteRswsByRTU(int id){
        return rswsMapper.deleteRswsByRTU(id);
    }

    public int deleteRsws(Map<String,Object> param){
        return rswsMapper.deleteRsws(param);
    }

    public List<Map<String,Object>> selectRswsHistory(Map<String,Object> param){
        return rswsMapper.selectRswsHistory(param);
    }

    public List<Map<String,Object>> exportRswsHistory(Map<String,Object> param){
        return rswsMapper.exportRswsHistory(param);
    }

    public int selectRswsHistoryCount(Map<String,Object> param){
        return rswsMapper.selectRswsHistoryCount(param);
    }

    public List<Map<String,Object>> selectRswsByRTU(int rtu_id){
        return rswsMapper.selectRswsByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return rswsMapper.deleteRTUAlarmData(param);
    }
}
