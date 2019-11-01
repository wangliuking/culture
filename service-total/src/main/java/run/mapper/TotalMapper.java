package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface TotalMapper {
    /*@Select("<script>" +
            "select a.*,b.site_id from rtu_alarm_data as a left join rtu_config as b on a.rtu_id = b.rtu_id where type=2 and alarmStatus=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id"+
            "</script>")
    List<Map<String,Object>> selectRTUOff(Map<String, Object> param);*/

    @Select("<script>" +
            "select * from site_config"+
            "</script>")
    List<Map<String,Object>> selectSite();

    @Select("<script>" +
            "select count(*) from site_config where site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectSiteTotal(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from rtu_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectRTUTotal(Map<String,Object> param);

    @Select("<script>" +
            "select t.* from (select a.*,b.rtu_state from rtu_config a left join rtu_now_data b on a.rtu_id=b.rtu_id where rtu_state=1 or rtu_state is null) t left join site_config s on t.site_id=s.site_id where s.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and s.site_id =#{site_id}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectRTUOff(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select a.* from rtu_config a left join rtu_now_data b on a.rtu_id=b.rtu_id where rtu_state=1 or rtu_state is null) t where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and t.site_id =#{site_id}"+
            "</if>"+
            "</script>")
    int selectRTUOffCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select a.*,b.site_id from rtu_alarm_data a left join rtu_config b on a.rtu_id = b.rtu_id left join site_config c on b.site_id=c.site_id where type=3 and alarmStatus=1 and c.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id"+
            "</script>")
    List<Map<String,Object>> selectRTUWarning(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select a.* from rtu_alarm_data a left join rtu_config b on a.rtu_id = b.rtu_id left join site_config c on b.site_id=c.site_id where type=3 and alarmStatus=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id) t"+
            "</script>")
    int selectRTUWarningCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select site_name as name,count(site_id) as value from (select b.site_id,c.site_name,a.* from rtu_alarm_data as a left join rtu_config as b on a.rtu_id = b.rtu_id left join site_config as c on b.site_id=c.site_id where type=3 and alarmStatus=1 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            " group by a.rtu_id,a.rtu_channel,a.devieceId) as t " +
            "group by site_id order by value desc limit 0,5"+
            "</script>")
    List<Map<String,Object>> selectSiteWarningTotal(Map<String, Object> param);

    @Select("<script>" +
            "select site_name as name,count(site_id) as value from (select b.site_id,c.site_name,a.* from rtu_alarm_data as a left join rtu_config as b on a.rtu_id = b.rtu_id left join site_config as c on b.site_id=c.site_id where type=1 and alarmStatus=1 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            " group by a.rtu_id,a.rtu_channel,a.devieceId) as t " +
            "group by site_id order by value desc limit 0,5"+
            "</script>")
    List<Map<String,Object>> selectSiteDeviceOffTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.* from site_config a left join site_now_data b on a.site_id=b.site_id where b.status=1 and a.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    List<Map<String,Object>> selectSiteOffTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.* from rtu_alarm_data a left join rtu_config b on a.rtu_id=b.rtu_id left join site_config c on b.site_id=c.site_id where type=3 and alarmStatus=1 and c.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id,rtu_channel,devieceId"+
            "</script>")
    List<Map<String,Object>> selectDeviceWarning(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select a.* from rtu_alarm_data a left join rtu_config b on a.rtu_id=b.rtu_id left join site_config c on b.site_id=c.site_id where type=3 and alarmStatus=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id,rtu_channel,devieceId) t"+
            "</script>")
    int selectDeviceWarningCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select a.* from rtu_alarm_data a left join rtu_config b on a.rtu_id=b.rtu_id left join site_config c on b.site_id=c.site_id where type=1 and alarmStatus=1 and c.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id,rtu_channel,devieceId"+
            "</script>")
    List<Map<String,Object>> selectDeviceOff(Map<String, Object> param);

    @Select("<script>" +
            "select * from site_config where site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectSiteById(Map<String, Object> param);

    @Select("<script>" +
            "select * from rtu_config where 1=1 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "</script>")
    Map<String,Object> selectRTUById(@Param("rtu_id")int rtu_id);

    @Select("<script>" +
            "select count(*) from rtu_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "</script>")
    int selectRTUNumBySiteId(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from rtu_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "</script>")
    int selectRTUNumBySiteIdCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select * from spd_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectSPDCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from spd_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "</script>")
    int selectSPDCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from spd_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "</script>")
    int selectSPDTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.spd_number,b.spd_state,a.spd_location from spd_config as a left join spd_now_data as b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number where 1=1 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectSPDPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from resistance_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,rst_id"+
            "</script>")
    List<Map<String,Object>> selectETCRCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from resistance_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,rst_id) t"+
            "</script>")
    int selectETCRCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from resistance_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,rst_id) as t"+
            "</script>")
    int selectETCRTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,sum(rst_state) rst_state,sum(alarm) alarm,a.rst_id from resistance_config as a left join resistance_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.rst_id=b.rst_id and a.relayno=b.relayno where a.rst_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.rst_id"+
            "</script>")
    List<Map<String,Object>> selectETCRPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from lightning_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,ltn_id"+
            "</script>")
    List<Map<String,Object>> selectLightningCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from lightning_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,ltn_id) t"+
            "</script>")
    int selectLightningCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from lightning_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,ltn_id) as t"+
            "</script>")
    int selectLightningTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.ltn_state,a.ltn_id,alarm from lightning_config as a left join lightning_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.ltn_id=b.ltn_id where a.ltn_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.ltn_id"+
            "</script>")
    List<Map<String,Object>> selectLightningPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from static_electricity_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,staet_id"+
            "</script>")
    List<Map<String,Object>> selectStaticCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from static_electricity_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,staet_id) t"+
            "</script>")
    int selectStaticCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from static_electricity_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,staet_id) as t"+
            "</script>")
    int selectStaticTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.staet_state,alarm,a.staet_id from static_electricity_config as a left join static_electricity_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.staet_id=b.staet_id where a.staet_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.staet_id"+
            "</script>")
    List<Map<String,Object>> selectStaticPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from humiture_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,hmt_id"+
            "</script>")
    List<Map<String,Object>> selectRswsCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from humiture_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,hmt_id) t"+
            "</script>")
    int selectRswsCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from humiture_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,hmt_id) as t"+
            "</script>")
    int selectRswsTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.hmt_state,sum(tempAlarm)+sum(humiAlarm) alarm,a.hmt_id from humiture_config as a left join humiture_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.hmt_id=b.hmt_id where a.hmt_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.hmt_id"+
            "</script>")
    List<Map<String,Object>> selectRswsPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from tilt_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,tilt_id"+
            "</script>")
    List<Map<String,Object>> selectSvtCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from tilt_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,tilt_id) t"+
            "</script>")
    int selectSvtCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from tilt_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,tilt_id) as t"+
            "</script>")
    int selectSvtTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.tilt_state,alarm,a.tilt_id from tilt_config as a left join tilt_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.tilt_id=b.tilt_id where a.tilt_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.tilt_id"+
            "</script>")
    List<Map<String,Object>> selectSvtPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from electrical_safety_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,es_id"+
            "</script>")
    List<Map<String,Object>> selectHcCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from electrical_safety_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,es_id) t"+
            "</script>")
    int selectHcCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from electrical_safety_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,es_id) as t"+
            "</script>")
    int selectHcTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.es_state,alarm,a.es_id from electrical_safety_config as a left join electrical_safety_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.es_id=b.es_id where a.es_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.es_id"+
            "</script>")
    List<Map<String,Object>> selectHcPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from stray_electricity_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,stret_id"+
            "</script>")
    List<Map<String,Object>> selectStrayCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from stray_electricity_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,stret_id) t"+
            "</script>")
    int selectStrayCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from stray_electricity_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,stret_id) as t"+
            "</script>")
    int selectStrayTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,sum(stret_state) stret_state,sum(alarm) alarm,a.stret_id from stray_electricity_config as a left join stray_electricity_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.stret_id=b.stret_id and a.portId=b.portId where a.stret_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.stret_id"+
            "</script>")
    List<Map<String,Object>> selectStray485Port(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.stret_state,sum(alarm) alarm from stray_electricity_config as a left join stray_electricity_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.stret_id=b.stret_id and a.portId=b.portId where a.stret_id=0"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port"+
            "</script>")
    List<Map<String,Object>> selectStrayTestPort(Map<String, Object> param);

    @Select("<script>" +
            "select * from cathode_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,cathode_id"+
            "</script>")
    List<Map<String,Object>> selectCatCount(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from "+
            "(select * from cathode_config where 1=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,cathode_id) t"+
            "</script>")
    int selectCatCountSchedule(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from (select a.* from cathode_config a left join site_config b on a.site_id=b.site_id where b.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,cathode_id) as t"+
            "</script>")
    int selectCatTotal(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.cathode_state,alarm,a.cathode_id from cathode_config as a left join cathode_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.cathode_id=b.cathode_id where a.cathode_id!=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.cathode_id"+
            "</script>")
    List<Map<String,Object>> selectCat485Port(Map<String, Object> param);

    @Select("<script>" +
            "select a.rtu_port,b.cathode_state,sum(alarm) alarm from cathode_config as a left join cathode_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.cathode_id=b.cathode_id where a.cathode_id=0 "+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port"+
            "</script>")
    List<Map<String,Object>> selectCatTestPort(Map<String, Object> param);

    @Select("<script>" +
            "select tempDate,count(tempDate) as num from " +
            "(select udpateTime,date_format(udpateTime,'%Y-%m-%d') as tempDate from rtu_alarm_history as a left join rtu_config as b on a.rtu_id=b.rtu_id left join site_config as c on b.site_id=c.site_id where type=1 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "and udpateTime between #{startTime} and #{endTime}) " +
            "as t group by tempDate"+
            "</script>")
    List<Map<String,Object>> selectDeviceOffByMonth(Map<String, Object> param);

    @Select("<script>" +
            "select tempDate,count(tempDate) as num from " +
            "(select udpateTime,date_format(udpateTime,'%Y-%m-%d') as tempDate from rtu_alarm_history as a left join rtu_config as b on a.rtu_id=b.rtu_id left join site_config as c on b.site_id=c.site_id where type=3 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "and udpateTime between #{startTime} and #{endTime}) " +
            "as t group by tempDate"+
            "</script>")
    List<Map<String,Object>> selectDeviceWarningByMonth(Map<String, Object> param);

    @Select("<script>" +
            "select tempDate,count(tempDate) as num from " +
            "(select udpateTime,date_format(udpateTime,'%Y-%m-%d') as tempDate from rtu_alarm_history as a left join rtu_config as b on a.rtu_id=b.rtu_id left join site_config as c on b.site_id=c.site_id where type=2 and c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"rtu_id != null and rtu_id != ''\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "and udpateTime between #{startTime} and #{endTime}) " +
            "as t group by tempDate"+
            "</script>")
    List<Map<String,Object>> selectRTUOffByMonth(Map<String, Object> param);


    @Select("<script>" +
            "select spd_state,write_time from spd_old_data as a left join spd_config as b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"spd_number != null and spd_number != -1\">" +
            "and b.spd_number =#{spd_number}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectSPDHistory(Map<String,Object> param);

    @Select("<script>" +
            "select rst_value,b.rst_type,a.relayno,write_time from resistance_old_data as a left join resistance_config as b on a.rtu_id=b.rtu_id and a.rst_id=b.rst_id and a.relayno=b.relayno left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"rst_id != null and rst_id != -1\">" +
            "and a.rst_id =#{rst_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectETCRHistory(Map<String,Object> param);

    @Select("<script>" +
            "select ltn_value,write_time from lightning_old_data as a left join lightning_config as b on a.rtu_id=b.rtu_id and a.ltn_id=b.ltn_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"ltn_id != null and ltn_id != -1\">" +
            "and b.ltn_id =#{ltn_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectLightningHistory(Map<String,Object> param);

    @Select("<script>" +
            "select staet_value,write_time from static_electricity_old_data as a left join static_electricity_config as b on a.rtu_id=b.rtu_id and a.staet_id=b.staet_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"staet_id != null and staet_id != -1\">" +
            "and b.staet_id =#{staet_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectStaticHistory(Map<String,Object> param);

    @Select("<script>" +
            "select hmt_temp,hmt_hm,write_time from humiture_old_data as a left join humiture_config as b on a.rtu_id=b.rtu_id and a.hmt_id=b.hmt_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"hmt_id != null and hmt_id != -1\">" +
            "and b.hmt_id =#{hmt_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectRswsHistory(Map<String,Object> param);

    @Select("<script>" +
            "select tilt_value1,tilt_value2,tilt_gx,tilt_gy,tilt_gs,write_time from tilt_old_data as a left join tilt_config as b on a.rtu_id=b.rtu_id and a.tilt_id=b.tilt_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"tilt_id != null and tilt_id != -1\">" +
            "and b.tilt_id =#{tilt_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectSvtHistory(Map<String,Object> param);

    @Select("<script>" +
            "select es_i_value,es_temp_value,es_cur_value,es_vol_value,write_time from electrical_safety_old_data as a left join electrical_safety_config as b on a.rtu_id=b.rtu_id and a.es_id=b.es_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"es_id != null and es_id != -1\">" +
            "and b.es_id =#{es_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectHcHistory(Map<String,Object> param);

    @Select("<script>" +
            "select stret_value,a.portId,write_time from stray_electricity_old_data as a left join stray_electricity_config as b on a.rtu_id=b.rtu_id and a.stret_id=b.stret_id and a.rtu_channel=b.rtu_port and a.portId=b.portId left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"stret_id != null and stret_id != -1\">" +
            "and b.stret_id =#{stret_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectStrayHistory(Map<String,Object> param);

    @Select("<script>" +
            "select cathode_value,write_time from cathode_old_data as a left join cathode_config as b on a.rtu_id=b.rtu_id and a.cathode_id=b.cathode_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"cathode_id != null and cathode_id != -1\">" +
            "and b.cathode_id =#{cathode_id}"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time"+
            "</script>")
    List<Map<String,Object>> selectCatHistory(Map<String,Object> param);


    @Select("<script>" +
            "select count(*) from spd_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectSPDCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from resistance_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectETCRCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from lightning_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectLightningCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from static_electricity_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectStaticCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from humiture_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectRswsCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from tilt_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectSvtCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from electrical_safety_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectHcCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from stray_electricity_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectStrayCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from cathode_old_data where 1=1 " +
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectCatCountByTime(Map<String,Object> param);

    @Select("<script>" +
            "select rtu_state from rtu_config a left join rtu_now_data b on a.rtu_id=b.rtu_id where a.site_id=#{site_id}" +
            "</script>")
    List<Integer> selectRTUStatusBySiteId(Map<String,Object> param);

    @Update("<script>" +
            "replace into site_now_data(site_id,status,updateTime,deviceNum,rtuNum) values " +
            "<foreach collection=\"siteList\" index=\"index\" item=\"item\" open=\"\" separator=\",\" close=\"\">"+
            "(#{item.site_id},#{item.status},now(),#{item.deviceNum},#{item.rtuNum})"+
            "</foreach>"+
            "</script>")
    int replaceSiteNowData(Map<String,Object> param);

    @Select("<script>" +
            "select * from lightning_config" +
            "</script>")
    List<Map<String,Object>> selectRTULightningConf();

    @Select("<script>" +
            "select *,count(rtu_id) num from lightning_old_data where alarm=1 group by rtu_id,ltn_id,rtu_channel" +
            "</script>")
    List<Map<String,Object>> selectLightningAlarm();

    @Select("<script>" +
            "select count(*) from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_channel} and devieceId=#{ltn_id} and relayNo=0 and type=3" +
            "</script>")
    int selectLightningAlarmStatusForNow(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from rtu_alarm_history where rtu_id=#{rtu_id} and rtu_channel=#{rtu_channel} and devieceId=#{ltn_id} and relayNo=0 and type=3" +
            "</script>")
    int selectLightningAlarmStatusForOld(Map<String,Object> param);

    @Insert("<script>" +
            "insert into rtu_alarm_data(rtu_id,rtu_channel,devieceId,deviceType,relayNo,alarmStatus,udpateTime,type,alarmStr) values(#{rtu_id},#{rtu_channel},#{ltn_id},2,0,1,now(),3,'雷电流超限')" +
            "</script>")
    int insertRTUNowDataForLightningAlarm(Map<String,Object> param);

    @Insert("<script>" +
            "insert into rtu_alarm_data(rtu_id,rtu_channel,devieceId,deviceType,relayNo,alarmStatus,udpateTime,type,alarmStr) values(#{rtu_id},#{rtu_channel},#{ltn_id},2,0,1,now(),3,'雷电流超限')" +
            "</script>")
    int insertRTUHisDataForLightningAlarm(Map<String,Object> param);

}
