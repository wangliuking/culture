package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.ETCR;
import run.mapper.ETCRMapper;

import java.util.List;
import java.util.Map;

@Service
public class ETCRService {
    @Autowired
    ETCRMapper ETCRMapper;

    public List<Map<String,Object>> selectAllETCR(int start, int limit, int site_id, int rtu_id){
        return ETCRMapper.selectAllETCR(start,limit,site_id,rtu_id);
    }

    public int selectAllETCRCount(int start,int limit,int site_id,int rtu_id){
        return ETCRMapper.selectAllETCRCount(start,limit,site_id,rtu_id);
    }

    public List<Map<String,Object>> selectAllRelayno(int start, int limit, int site_id, int rtu_id){
        return ETCRMapper.selectAllRelayno(start,limit,site_id,rtu_id);
    }

    public int selectAllRelaynoCount(int start,int limit,int site_id,int rtu_id){
        return ETCRMapper.selectAllRelaynoCount(start,limit,site_id,rtu_id);
    }

    public List<ETCR> selectETCRByRTUIdAndRSTId(Map<String,Object> params){
        return ETCRMapper.selectETCRByRTUIdAndRSTId(params);
    }

    public int insertETCR(ETCR ETCR){
        return ETCRMapper.insertETCR(ETCR);
    }

    public int deleteETCRBySite(int id){
        return ETCRMapper.deleteETCRBySite(id);
    }

    public int selectETCRCountBySiteId(int id){
        return ETCRMapper.selectETCRCountBySiteId(id);
    }

    public int deleteETCRByRTU(int id){
        return ETCRMapper.deleteETCRByRTU(id);
    }

    public int deleteETCR(Map<String,Object> param){
        return ETCRMapper.deleteETCR(param);
    }

    public int updateETCR(ETCR ETCR){
        return ETCRMapper.updateETCR(ETCR);
    }

    public ETCR selectByETCR(Map<String,Object> param){
        return ETCRMapper.selectByETCR(param);
    }

    public Map<String,Object> selectNowData(Map<String,Object> param){
        return ETCRMapper.selectNowData(param);
    }

    public List<ETCR> selectETCRByRTUID4RSTID(Map<String,Object> param){
        return ETCRMapper.selectETCRByRTUID4RSTID(param);
    }

    public List<Map<String,Object>> selectETCRHistory(int start, int limit, int site_id, int rtu_id, int rst_id, String rst_location,String startTime,String endTime){
        return ETCRMapper.selectETCRHistory(start,limit,site_id,rtu_id,rst_id,rst_location,startTime,endTime);
    }

    public int selectETCRHistoryCount(int start, int limit, int site_id, int rtu_id, int rst_id, String rst_location,String startTime,String endTime){
        return ETCRMapper.selectETCRHistoryCount(start,limit,site_id,rtu_id,rst_id,rst_location,startTime,endTime);
    }

    public List<Map<String,Object>> selectETCROneTypeCount(int rtu_id){
        return ETCRMapper.selectETCROneTypeCount(rtu_id);
    }

    public List<Map<String,Object>> selectETCROneType(Map<String,Object> param){
        return ETCRMapper.selectETCROneType(param);
    }

    public List<Map<String,Object>> selectETCRTwoType(int rtu_id){
        return ETCRMapper.selectETCRTwoType(rtu_id);
    }

    public List<Map<String,Object>> selectETCRThreeType(int rtu_id){
        return ETCRMapper.selectETCRThreeType(rtu_id);
    }
}
