package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import protobuf.jsonbean.AlarmInfo;


import java.util.List;
import java.util.Map;

@Repository
public interface AlarmInfoMapper {

    @Select("<script>" +
            "select a.*,c.site_id,c.site_name from rtu_alarm_data as a left join rtu_config as b on a.rtu_Id=b.rtu_id left join site_config as c on b.site_id=c.site_id where a.alarmStatus=1 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and c.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtuId != null and rtuId != -1\">" +
            "and a.rtu_Id =#{rtuId}"+
            "</if>"+
            "<if test=\"type != null and type != -1\">" +
            "and type =#{type}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != '' and startTime != 'null'\">" +
            "and udpateTime between #{startTime} and #{endTime}"+
            "</if>"+
            "order by udpateTime desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllAlarmInfoNow(Map<String,Object> params);

    @Select("<script>" +
            "select count(*) from rtu_alarm_data as a left join rtu_config as b on a.rtu_Id=b.rtu_id left join site_config as c on b.site_id=c.site_id where a.alarmStatus=1 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and c.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtuId != null and rtuId != -1\">" +
            "and a.rtu_Id =#{rtuId}"+
            "</if>"+
            "<if test=\"type != null and type != -1\">" +
            "and type =#{type}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != '' and startTime != 'null'\">" +
            "and udpateTime between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectAllAlarmInfoNowCount(Map<String,Object> params);

    @Select("<script>" +
            "select a.*,c.site_id,c.site_name from rtu_alarm_history as a left join rtu_config as b on a.rtu_Id=b.rtu_id left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and c.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtuId != null and rtuId != -1\">" +
            "and a.rtu_Id =#{rtuId}"+
            "</if>"+
            "<if test=\"type != null and type != -1\">" +
            "and type =#{type}"+
            "</if>"+
            "<if test=\"alarmStatus != null and alarmStatus != -1\">" +
            "and alarmStatus =#{alarmStatus}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != '' and startTime != 'null'\">" +
            "and udpateTime between #{startTime} and #{endTime}"+
            "</if>"+
            "order by udpateTime desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllAlarmInfo(Map<String,Object> params);

    @Select("<script>" +
            "select count(*) from rtu_alarm_history as a left join rtu_config as b on a.rtu_Id=b.rtu_id left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and c.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtuId != null and rtuId != -1\">" +
            "and a.rtu_Id =#{rtuId}"+
            "</if>"+
            "<if test=\"type != null and type != -1\">" +
            "and type =#{type}"+
            "</if>"+
            "<if test=\"alarmStatus != null and alarmStatus != -1\">" +
            "and alarmStatus =#{alarmStatus}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != '' and startTime != 'null'\">" +
            "and udpateTime between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectAllAlarmInfoCount(Map<String,Object> params);
    
    @Insert("insert into rtu_alarm_history(rtu_id,rtu_channel,devieceId,deviceType,relayNo,alarmStatus,udpateTime,type,alarmStr) values(#{rtuId},#{channo},#{deviceid},#{devicetype},#{relayno},#{status},now(),3,#{alarmStr})")
    int insertAlarmInfo(AlarmInfo alarmInfo);

    @Insert("replace into rtu_alarm_data(rtu_id,rtu_channel,devieceId,deviceType,relayNo,alarmStatus,udpateTime,type,alarmStr) values(#{rtuId},#{channo},#{deviceid},#{devicetype},#{relayno},#{status},now(),3,#{alarmStr})")
    int insertAlarmNow(AlarmInfo alarmInfo);

    @Delete("delete from rtu_alarm_data where rtu_channel=#{channo} and devieceId=#{deviceid} and relayNo=#{relayno} and rtu_id=#{rtuId} and deviceType=#{devicetype} and type=3")
    int deleteAlarmNow(AlarmInfo alarmInfo);

    @Update("update resistance_now_data set rst_state=#{status} where rtu_id=#{rtuId} and rst_id=#{deviceid} and rtu_channel=#{channo} and relayno=#{relayno}")
    int updateEtcrNow(AlarmInfo alarmInfo);

    @Update("update lightning_now_data set ltn_state=#{status} where rtu_id=#{rtuId} and ltn_id=#{deviceid} and rtu_channel=#{channo}")
    int updateLightningNow(AlarmInfo alarmInfo);

    @Update("update static_electricity_now_data set staet_state=#{status} where rtu_id=#{rtuId} and staet_id=#{deviceid} and rtu_channel=#{channo}")
    int updateStaticNow(AlarmInfo alarmInfo);

    @Update("update humiture_now_data set hmt_state=#{status} where rtu_id=#{rtuId} and hmt_id=#{deviceid} and rtu_channel=#{channo}")
    int updateRswsNow(AlarmInfo alarmInfo);

    @Update("update tilt_now_data set tilt_state=#{status} where rtu_id=#{rtuId} and tilt_id=#{deviceid} and rtu_channel=#{channo}")
    int updateSvtNow(AlarmInfo alarmInfo);

    @Update("update electrical_safety_now_data set es_state=#{status} where rtu_id=#{rtuId} and es_id=#{deviceid} and rtu_channel=#{channo}")
    int updateHcNow(AlarmInfo alarmInfo);

    @Update("update stray_electricity_now_data set stret_state=#{status} where rtu_id=#{rtuId} and stret_id=#{deviceid} and rtu_channel=#{channo} and portId=#{relayno}")
    int updateStrayNow(AlarmInfo alarmInfo);

    @Update("update cathode_now_data set cathode_state=#{status} where rtu_id=#{rtuId} and cathode_id=#{deviceid} and rtu_channel=#{channo}")
    int updateCatNow(AlarmInfo alarmInfo);
}
