package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.SPD;
import run.mapper.SPDMapper;

import java.util.List;
import java.util.Map;

@Service
public class SPDService {
    @Autowired
    SPDMapper spdMapper;

    public List<Map<String,Object>> selectAllSPD(Map<String,Object> param){
        return spdMapper.selectAllSPD(param);
    }

    public int selectAllSPDCount(Map<String,Object> param){
        return spdMapper.selectAllSPDCount(param);
    }

    public int insertSPD(SPD spd){
        return spdMapper.insertSPD(spd);
    }

    public int deleteSPDBySite(int id){
        return spdMapper.deleteSPDBySite(id);
    }

    public int deleteSPDByRTU(int id){
        return spdMapper.deleteSPDByRTU(id);
    }

    public int selectSPDCountBySite(int id){
        return spdMapper.selectSPDCountBySite(id);
    }

    public int deleteSPD(int site_id,int rtu_id,int spd_number){
        return spdMapper.deleteSPD(site_id,rtu_id,spd_number);
    }

    public int updateSPD(SPD spd){
        return spdMapper.updateSPD(spd);
    }

    public SPD selectBySPD(int site_id,int rtu_id,int spd_number){
        return spdMapper.selectBySPD(site_id,rtu_id,spd_number);
    }

    public List<Map<String,Object>> selectAllSPDByRTU(int rtu_id){
        return spdMapper.selectAllSPDByRTU(rtu_id);
    }

    public List<Integer> selectByRTU(int rtu_id){
        return spdMapper.selectByRTU(rtu_id);
    }

    public int updateSPDByRTU(Map<String,Object> params){
        return spdMapper.updateSPDByRTU(params);
    }

    public List<Map<String,Object>> selectSPDHistory(Map<String,Object> param){
        return spdMapper.selectSPDHistory(param);
    }

    public List<Map<String,Object>> exportSPDHistory(Map<String,Object> param){
        return spdMapper.exportSPDHistory(param);
    }

    public int selectSPDHistoryCount(Map<String,Object> param){
        return spdMapper.selectSPDHistoryCount(param);
    }

    public int selectSPDNumByRTU(int rtu_id){
        return spdMapper.selectSPDNumByRTU(rtu_id);
    }
}
