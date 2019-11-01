package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Static;

import java.util.List;
import java.util.Map;

@Repository
public interface StaticMapper {

    @Select("<script>" +
            "select a.*,b.staet_state,b.alarm,count(b.staet_state) num,e.rtu_state from static_electricity_config as a left join static_electricity_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.staet_id=b.staet_id left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.staet_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllStatic(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from static_electricity_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,staet_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllStaticCount(Map<String,Object> param);

    @Insert("insert into static_electricity_config(site_id,rtu_id,rtu_port,rtu_baud_rate,staet_id,staet_name,staet_model,staet_location,staet_threshold1,staet_threshold2,staet_k,staet_v0,staet_space,staet_ospace) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{staet_id},#{staet_name},#{staet_model},#{staet_location},#{staet_threshold1},#{staet_threshold2},#{staet_k},#{staet_v0},#{staet_space},#{staet_ospace})")
    int insertStatic(Static Static);

    @Delete("delete from static_electricity_config where site_id = #{id}")
    int deleteStaticBySite(int id);

    @Delete("delete from static_electricity_config where rtu_id = #{id}")
    int deleteStaticByRTU(int id);

    @Delete("delete from static_electricity_config where rtu_id = #{rtu_id} and staet_id = #{staet_id} and rtu_port=#{rtu_port}")
    int deleteStatic(Map<String, Object> param);

    @Update("update static_electricity_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},staet_name=#{staet_name},staet_model=#{staet_model},staet_location=#{staet_location},staet_threshold1=#{staet_threshold1},staet_threshold2=#{staet_threshold2},staet_k=#{staet_k},staet_v0=#{staet_v0},staet_space=#{staet_space},staet_ospace=#{staet_ospace} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and staet_id=#{staet_id}")
    int updateStatic(Static Static);

    @Select("select * from static_electricity_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and staet_id=#{staet_id}")
    Static selectOneStatic(Map<String, Object> param);

    @Select("select a.*,b.staet_location from static_electricity_now_data a left join static_electricity_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.staet_id=b.staet_id where a.rtu_id=#{rtu_id}")
    List<Map<String,Object>> selectStaticByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.staet_location,b.staet_name,b.staet_model,c.*,d.name as structureName from static_electricity_old_data as a left join static_electricity_config as b on a.rtu_id=b.rtu_id and a.staet_id=b.staet_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"staet_id != null and staet_id != -1\">" +
            "and b.staet_id =#{staet_id}"+
            "</if>"+
            "<if test=\"staet_location != null and staet_location != ''\">" +
            "and staet_location like concat('%',#{staet_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectStaticHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.staet_location,b.staet_name,b.staet_model,c.*,d.name as structureName from static_electricity_old_data as a left join static_electricity_config as b on a.rtu_id=b.rtu_id and a.staet_id=b.staet_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"staet_id != null and staet_id != -1\">" +
            "and b.staet_id =#{staet_id}"+
            "</if>"+
            "<if test=\"staet_location != null and staet_location != ''\">" +
            "and staet_location like concat('%',#{staet_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportStaticHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from static_electricity_old_data as a left join static_electricity_config as b on a.rtu_id=b.rtu_id and a.staet_id=b.staet_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"staet_id != null and staet_id != -1\">" +
            "and b.staet_id =#{staet_id}"+
            "</if>"+
            "<if test=\"staet_location != null and staet_location != ''\">" +
            "and staet_location like concat('%',#{staet_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectStaticHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{staet_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
