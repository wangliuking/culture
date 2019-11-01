package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Hc;

import java.util.List;
import java.util.Map;

@Repository
public interface HcMapper {

    @Select("<script>" +
            "select a.*,b.es_state,b.alarm,count(b.es_state) num,e.rtu_state from electrical_safety_config as a left join electrical_safety_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.es_id=b.es_id left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.es_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllHc(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from electrical_safety_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,es_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllHcCount(Map<String,Object> param);

    @Insert("insert into electrical_safety_config(site_id,rtu_id,rtu_port,rtu_baud_rate,es_id,es_name,es_model,es_location,es_i_threshold,es_temp_threshold,es_cur_threshold,es_vol_threshold,es_space,es_ospace) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{es_id},#{es_name},#{es_model},#{es_location},#{es_i_threshold},#{es_temp_threshold},#{es_cur_threshold},#{es_vol_threshold},#{es_space},#{es_ospace})")
    int insertHc(Hc Hc);

    @Delete("delete from electrical_safety_config where site_id = #{id}")
    int deleteHcBySite(int id);

    @Delete("delete from electrical_safety_config where rtu_id = #{id}")
    int deleteHcByRTU(int id);

    @Delete("delete from electrical_safety_config where rtu_id = #{rtu_id} and es_id = #{es_id} and rtu_port=#{rtu_port}")
    int deleteHc(Map<String, Object> param);

    @Update("update electrical_safety_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},es_name=#{es_name},es_model=#{es_model},es_location=#{es_location},es_i_threshold=#{es_i_threshold},es_temp_threshold=#{es_temp_threshold},es_cur_threshold=#{es_cur_threshold},es_vol_threshold=#{es_vol_threshold},es_space=#{es_space},es_ospace=#{es_ospace} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and es_id=#{es_id}")
    int updateHc(Hc Hc);

    @Select("select * from electrical_safety_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and es_id=#{es_id}")
    Hc selectOneHc(Map<String, Object> param);

    @Select("select a.*,b.es_location from electrical_safety_now_data a left join electrical_safety_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.es_id=b.es_id where a.rtu_id=#{rtu_id}")
    List<Map<String,Object>> selectHcByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.es_location,b.es_name,b.es_model,c.*,d.name as structureName from electrical_safety_old_data as a left join electrical_safety_config as b on a.rtu_id=b.rtu_id and a.es_id=b.es_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"es_id != null and es_id != -1\">" +
            "and b.es_id =#{es_id}"+
            "</if>"+
            "<if test=\"es_location != null and es_location != ''\">" +
            "and es_location like concat('%',#{es_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectHcHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.es_location,b.es_name,b.es_model,c.*,d.name as structureName from electrical_safety_old_data as a left join electrical_safety_config as b on a.rtu_id=b.rtu_id and a.es_id=b.es_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"es_id != null and es_id != -1\">" +
            "and b.es_id =#{es_id}"+
            "</if>"+
            "<if test=\"es_location != null and es_location != ''\">" +
            "and es_location like concat('%',#{es_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportHcHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from electrical_safety_old_data as a left join electrical_safety_config as b on a.rtu_id=b.rtu_id and a.es_id=b.es_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"es_id != null and es_id != -1\">" +
            "and b.es_id =#{es_id}"+
            "</if>"+
            "<if test=\"es_location != null and es_location != ''\">" +
            "and es_location like concat('%',#{es_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectHcHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{es_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
