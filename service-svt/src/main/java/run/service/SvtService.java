package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Svt;
import run.mapper.SvtMapper;

import java.util.List;
import java.util.Map;

@Service
public class SvtService {
    @Autowired
    SvtMapper svtMapper;

    public List<Map<String,Object>> selectAllSvt(Map<String,Object> param){
        return svtMapper.selectAllSvt(param);
    }

    public int selectAllSvtCount(Map<String,Object> param){
        return svtMapper.selectAllSvtCount(param);
    }


    public int insertSvt(Svt Svt){
        return svtMapper.insertSvt(Svt);
    }

    public int updateSvt(Svt Svt){
        return svtMapper.updateSvt(Svt);
    }

    public Svt selectOneLight(Map<String,Object> param){
        return svtMapper.selectOneSvt(param);
    }

    public int deleteSvtBySite(int id){
        return svtMapper.deleteSvtBySite(id);
    }

    public int deleteSvtByRTU(int id){
        return svtMapper.deleteSvtByRTU(id);
    }

    public int deleteSvt(Map<String,Object> param){
        return svtMapper.deleteSvt(param);
    }

    public List<Map<String,Object>> selectSvtHistory(Map<String,Object> param){
        return svtMapper.selectSvtHistory(param);
    }

    public List<Map<String,Object>> exportSvtHistory(Map<String,Object> param){
        return svtMapper.exportSvtHistory(param);
    }

    public int selectSvtHistoryCount(Map<String,Object> param){
        return svtMapper.selectSvtHistoryCount(param);
    }

    public List<Map<String,Object>> selectSvtByRTU(int rtu_id){
        return svtMapper.selectSvtByRTU(rtu_id);
    }

    public int deleteRTUAlarmData(Map<String,Object> param){
        return svtMapper.deleteRTUAlarmData(param);
    }
}
