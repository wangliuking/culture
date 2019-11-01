package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Lightning;

import java.util.List;
import java.util.Map;

@Repository
public interface LightningMapper {

    @Select("<script>" +
            "select a.*,b.ltn_state,b.alarm,count(b.ltn_state) num,e.rtu_state from lightning_config as a left join lightning_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.ltn_id=b.ltn_id left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.ltn_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllLightning(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from lightning_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,ltn_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllLightningCount(Map<String,Object> param);

    @Insert("insert into lightning_config(site_id,rtu_id,rtu_port,rtu_baud_rate,ltn_id,ltn_name,ltn_model,ltn_location,ltn_threshold1,ltn_threshold2,ltn_times,ltn_space,ltn_ospace) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{ltn_id},#{ltn_name},#{ltn_model},#{ltn_location},#{ltn_threshold1},#{ltn_threshold2},#{ltn_times},#{ltn_space},#{ltn_ospace})")
    int insertLightning(Lightning lightning);

    @Delete("delete from lightning_config where site_id = #{id}")
    int deleteLightningBySite(int id);

    @Delete("delete from lightning_config where rtu_id = #{id}")
    int deleteLightningByRTU(int id);

    @Delete("delete from lightning_config where rtu_id = #{rtu_id} and ltn_id = #{ltn_id} and rtu_port=#{rtu_port}")
    int deleteLightning(Map<String, Object> param);

    @Update("update lightning_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},ltn_name=#{ltn_name},ltn_model=#{ltn_model},ltn_location=#{ltn_location},ltn_threshold1=#{ltn_threshold1},ltn_threshold2=#{ltn_threshold2},ltn_times=#{ltn_times},ltn_space=#{ltn_space},ltn_ospace=#{ltn_ospace} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and ltn_id=#{ltn_id}")
    int updateLightning(Lightning lightning);

    @Select("select * from lightning_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and ltn_id=#{ltn_id}")
    Lightning selectOneLight(Map<String,Object> param);

    @Select("select a.*,b.ltn_location from lightning_now_data a left join lightning_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.ltn_id=b.ltn_id where a.rtu_id=#{rtu_id}")
    List<Map<String,Object>> selectLightningByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.ltn_location,b.ltn_name,b.ltn_model,c.*,d.name as structureName from lightning_old_data as a left join lightning_config as b on a.rtu_id=b.rtu_id and a.ltn_id=b.ltn_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"ltn_id != null and ltn_id != -1\">" +
            "and b.ltn_id =#{ltn_id}"+
            "</if>"+
            "<if test=\"ltn_location != null and ltn_location != ''\">" +
            "and ltn_location like concat('%',#{ltn_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectLightningHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.ltn_location,b.ltn_name,b.ltn_model,c.*,d.name as structureName from lightning_old_data as a left join lightning_config as b on a.rtu_id=b.rtu_id and a.ltn_id=b.ltn_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"ltn_id != null and ltn_id != -1\">" +
            "and b.ltn_id =#{ltn_id}"+
            "</if>"+
            "<if test=\"ltn_location != null and ltn_location != ''\">" +
            "and ltn_location like concat('%',#{ltn_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportLightningHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from lightning_old_data as a left join lightning_config as b on a.rtu_id=b.rtu_id and a.ltn_id=b.ltn_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"ltn_id != null and ltn_id != -1\">" +
            "and b.ltn_id =#{ltn_id}"+
            "</if>"+
            "<if test=\"ltn_location != null and ltn_location != ''\">" +
            "and ltn_location like concat('%',#{ltn_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectLightningHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{ltn_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
