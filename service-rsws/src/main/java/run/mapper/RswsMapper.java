package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Rsws;

import java.util.List;
import java.util.Map;

@Repository
public interface RswsMapper {

    @Select("<script>" +
            "select a.*,b.hmt_state,b.tempAlarm,b.humiAlarm,count(b.hmt_state) num,e.rtu_state from humiture_config as a left join humiture_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.hmt_id=b.hmt_id left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.hmt_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllRsws(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from humiture_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,hmt_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllRswsCount(Map<String,Object> param);

    @Insert("insert into humiture_config(site_id,rtu_id,rtu_port,rtu_baud_rate,hmt_id,hmt_name,hmt_model,hmt_location,hmt_temp_threshold1,hmt_temp_threshold2,hmt_hum_threshold,hmt_space,hmt_ospace) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{hmt_id},#{hmt_name},#{hmt_model},#{hmt_location},#{hmt_temp_threshold1},#{hmt_temp_threshold2},#{hmt_hum_threshold},#{hmt_space},#{hmt_ospace})")
    int insertRsws(Rsws Rsws);

    @Delete("delete from humiture_config where site_id = #{id}")
    int deleteRswsBySite(int id);

    @Delete("delete from humiture_config where rtu_id = #{id}")
    int deleteRswsByRTU(int id);

    @Delete("delete from humiture_config where rtu_id = #{rtu_id} and hmt_id = #{hmt_id} and rtu_port=#{rtu_port}")
    int deleteRsws(Map<String, Object> param);

    @Update("update humiture_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},hmt_name=#{hmt_name},hmt_model=#{hmt_model},hmt_location=#{hmt_location},hmt_temp_threshold1=#{hmt_temp_threshold1},hmt_temp_threshold2=#{hmt_temp_threshold2},hmt_hum_threshold=#{hmt_hum_threshold},hmt_space=#{hmt_space},hmt_ospace=#{hmt_ospace} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and hmt_id=#{hmt_id}")
    int updateRsws(Rsws Rsws);

    @Select("select * from humiture_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and hmt_id=#{hmt_id}")
    Rsws selectOneRsws(Map<String, Object> param);

    @Select("select a.*,b.hmt_location from humiture_now_data a left join humiture_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.hmt_id=b.hmt_id where a.rtu_id=#{rtu_id}")
    List<Map<String,Object>> selectRswsByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.hmt_location,b.hmt_name,b.hmt_model,c.*,d.name as structureName from humiture_old_data as a left join humiture_config as b on a.rtu_id=b.rtu_id and a.hmt_id=b.hmt_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"hmt_id != null and hmt_id != -1\">" +
            "and b.hmt_id =#{hmt_id}"+
            "</if>"+
            "<if test=\"hmt_location != null and hmt_location != ''\">" +
            "and hmt_location like concat('%',#{hmt_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectRswsHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.hmt_location,b.hmt_name,b.hmt_model,c.*,d.name as structureName from humiture_old_data as a left join humiture_config as b on a.rtu_id=b.rtu_id and a.hmt_id=b.hmt_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"hmt_id != null and hmt_id != -1\">" +
            "and b.hmt_id =#{hmt_id}"+
            "</if>"+
            "<if test=\"hmt_location != null and hmt_location != ''\">" +
            "and hmt_location like concat('%',#{hmt_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportRswsHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from humiture_old_data as a left join humiture_config as b on a.rtu_id=b.rtu_id and a.hmt_id=b.hmt_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"hmt_id != null and hmt_id != -1\">" +
            "and b.hmt_id =#{hmt_id}"+
            "</if>"+
            "<if test=\"hmt_location != null and hmt_location != ''\">" +
            "and hmt_location like concat('%',#{hmt_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectRswsHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{hmt_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
