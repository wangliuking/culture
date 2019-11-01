package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Stray;

import java.util.List;
import java.util.Map;

@Repository
public interface StrayMapper {

    @Select("<script>" +
            "select a.*,sum(b.stret_state) stret_state,sum(b.alarm) alarm,count(b.stret_state) num,e.rtu_state from stray_electricity_config as a left join stray_electricity_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.stret_id=b.stret_id and a.portId=b.portId left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.stret_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllStray(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from stray_electricity_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,stret_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllStrayCount(Map<String,Object> param);

    @Insert("insert into stray_electricity_config(site_id,rtu_id,rtu_port,rtu_baud_rate,stret_id,portId,equipType,stret_name,stret_model,stret_location,stret_threshold1,stret_threshold2,fullscale,calvalue,factor,computeType,stret_space,stret_ospace,portName) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{stret_id},#{portId},#{equipType},#{stret_name},#{stret_model},#{stret_location},#{stret_threshold1},#{stret_threshold2},#{fullscale},#{calvalue},#{factor},#{computeType},#{stret_space},#{stret_ospace},#{portName})")
    int insertStray(Stray Stray);

    @Delete("delete from stray_electricity_config where site_id = #{id}")
    int deleteStrayBySite(int id);

    @Delete("delete from stray_electricity_config where rtu_id = #{id}")
    int deleteStrayByRTU(int id);

    @Delete("delete from stray_electricity_config where rtu_id = #{rtu_id} and stret_id = #{stret_id} and rtu_port=#{rtu_port}")
    int deleteStray(Map<String, Object> param);

    @Update("update stray_electricity_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},equipType=#{equipType},stret_name=#{stret_name},stret_model=#{stret_model},stret_location=#{stret_location},stret_threshold1=#{stret_threshold1},stret_threshold2=#{stret_threshold2},fullscale=#{fullscale},calvalue=#{calvalue},factor=#{factor},computeType=#{computeType},stret_space=#{stret_space},stret_ospace=#{stret_ospace},portName=#{portName} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and stret_id=#{stret_id} and portId=#{portId}")
    int updateStray(Stray Stray);

    @Select("select * from stray_electricity_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and stret_id=#{stret_id}")
    List<Stray> selectStray(Map<String, Object> param);

    @Select("select a.*,b.stret_location from stray_electricity_now_data a left join stray_electricity_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.stret_id=b.stret_id and a.portId=b.portId where a.rtu_id=#{rtu_id} group by a.stret_id")
    List<Map<String,Object>> selectStrayByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.stret_location,b.stret_name,b.portName,b.stret_model,c.*,d.name as structureName from stray_electricity_old_data as a left join stray_electricity_config as b on a.rtu_id=b.rtu_id and a.stret_id=b.stret_id and a.rtu_channel=b.rtu_port and a.portId=b.portId left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"stret_id != null and stret_id != -1\">" +
            "and b.stret_id =#{stret_id}"+
            "</if>"+
            "<if test=\"stret_location != null and stret_location != ''\">" +
            "and stret_location like concat('%',#{stret_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectStrayHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.stret_location,b.stret_name,b.portName,b.stret_model,c.*,d.name as structureName from stray_electricity_old_data as a left join stray_electricity_config as b on a.rtu_id=b.rtu_id and a.stret_id=b.stret_id and a.rtu_channel=b.rtu_port and a.portId=b.portId left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"stret_id != null and stret_id != -1\">" +
            "and b.stret_id =#{stret_id}"+
            "</if>"+
            "<if test=\"stret_location != null and stret_location != ''\">" +
            "and stret_location like concat('%',#{stret_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportStrayHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from stray_electricity_old_data as a left join stray_electricity_config as b on a.rtu_id=b.rtu_id and a.stret_id=b.stret_id and a.rtu_channel=b.rtu_port and a.portId=b.portId left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"stret_id != null and stret_id != -1\">" +
            "and b.stret_id =#{stret_id}"+
            "</if>"+
            "<if test=\"stret_location != null and stret_location != ''\">" +
            "and stret_location like concat('%',#{stret_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectStrayHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{stret_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
