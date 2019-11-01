package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import protobuf.jsonbean.AlarmInfo;
import run.mapper.AlarmInfoMapper;
import java.util.List;
import java.util.Map;

@Service
public class AlarmInfoService {
    @Autowired
    AlarmInfoMapper alarmInfoMapper;

    public List<Map<String,Object>> selectAllAlarmInfoNow(Map<String,Object> params){
        return alarmInfoMapper.selectAllAlarmInfoNow(params);
    }

    public int selectAllAlarmInfoNowCount(Map<String,Object> params){
        return alarmInfoMapper.selectAllAlarmInfoNowCount(params);
    }

    public List<Map<String,Object>> selectAllAlarmInfo(Map<String,Object> params){
        return alarmInfoMapper.selectAllAlarmInfo(params);
    }

    public int selectAllAlarmInfoCount(Map<String,Object> params){
        return alarmInfoMapper.selectAllAlarmInfoCount(params);
    }

    public int insertAlarmInfo(AlarmInfo alarmInfo){
        return alarmInfoMapper.insertAlarmInfo(alarmInfo);
    }

    public void changeAlarmNow(AlarmInfo alarmInfo){
        if(alarmInfo.getStatus() == 1){
            alarmInfoMapper.insertAlarmNow(alarmInfo);
        }else if(alarmInfo.getStatus() == 0){
            alarmInfoMapper.deleteAlarmNow(alarmInfo);
        }
    }

    public int updateEtcrNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateEtcrNow(alarmInfo);
    }

    public int updateLightningNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateLightningNow(alarmInfo);
    }

    public int updateStaticNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateStaticNow(alarmInfo);
    }

    public int updateRswsNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateRswsNow(alarmInfo);
    }

    public int updateSvtNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateSvtNow(alarmInfo);
    }

    public int updateHcNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateHcNow(alarmInfo);
    }

    public int updateStrayNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateStrayNow(alarmInfo);
    }

    public int updateCatNow(AlarmInfo alarmInfo){
        return alarmInfoMapper.updateCatNow(alarmInfo);
    }
}
