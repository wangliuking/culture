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

    public List<Map<String,Object>> selectAllRTU(int start, int limit, int site_id, int connect_type, String rtu_ip, String rtu_netmask, String rtu_gateway){
        return rtuMapper.selectAllRTU(start,limit,site_id,connect_type,rtu_ip,rtu_netmask,rtu_gateway);
    }

    public int selectAllRTUCount(int start,int limit,int site_id,int connect_type,String rtu_ip,String rtu_netmask,String rtu_gateway){
        return rtuMapper.selectAllRTUCount(start,limit,site_id,connect_type,rtu_ip,rtu_netmask,rtu_gateway);
    }

    public RTU selectRTUById(int id){
        return rtuMapper.selectRTUById(id);
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
}
