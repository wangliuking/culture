package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Cat;

import java.util.List;
import java.util.Map;

@Repository
public interface CatMapper {

    @Select("<script>" +
            "select a.*,b.cathode_state,b.alarm,count(b.cathode_state) num,e.rtu_state from cathode_config as a left join cathode_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.cathode_id=b.cathode_id left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.cathode_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllCat(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from cathode_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,cathode_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllCatCount(Map<String,Object> param);

    @Insert("insert into cathode_config(site_id,rtu_id,rtu_port,rtu_baud_rate,cathode_id,cathode_name,cathode_model,cathode_location,cathode_paramter,cathode_threshold1,cathode_threshold2,fullscale,calvalue,factor,computeType,cathode_space,cathode_ospace) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{cathode_id},#{cathode_name},#{cathode_model},#{cathode_location},#{cathode_paramter},#{cathode_threshold1},#{cathode_threshold2},#{fullscale},#{calvalue},#{factor},#{computeType},#{cathode_space},#{cathode_ospace})")
    int insertCat(Cat Cat);

    @Delete("delete from cathode_config where site_id = #{id}")
    int deleteCatBySite(int id);

    @Delete("delete from cathode_config where rtu_id = #{id}")
    int deleteCatByRTU(int id);

    @Delete("delete from cathode_config where rtu_id = #{rtu_id} and cathode_id = #{cathode_id} and rtu_port=#{rtu_port}")
    int deleteCat(Map<String, Object> param);

    @Update("update cathode_config set site_id=#{site_id},rtu_baud_rate=#{rtu_baud_rate},cathode_name=#{cathode_name},cathode_model=#{cathode_model},cathode_location=#{cathode_location},cathode_paramter=#{cathode_paramter},cathode_threshold1=#{cathode_threshold1},cathode_threshold2=#{cathode_threshold2},fullscale=#{fullscale},calvalue=#{calvalue},factor=#{factor},computeType=#{computeType},cathode_space=#{cathode_space},cathode_ospace=#{cathode_ospace} where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and cathode_id=#{cathode_id}")
    int updateCat(Cat Cat);

    @Select("select * from cathode_config where rtu_id=#{rtu_id} and rtu_port=#{rtu_port} and cathode_id=#{cathode_id}")
    Cat selectOneCat(Map<String, Object> param);

    @Select("select * from cathode_now_data a left join cathode_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.cathode_id=b.cathode_id where a.rtu_id=#{rtu_id}")
    List<Map<String,Object>> selectCatByRTU(int rtu_id);

    @Select("<script>" +
            "select a.*,b.cathode_location,b.cathode_name,b.cathode_model,c.*,d.name as structureName from cathode_old_data as a left join cathode_config as b on a.rtu_id=b.rtu_id and a.cathode_id=b.cathode_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"cathode_id != null and cathode_id != -1\">" +
            "and b.cathode_id =#{cathode_id}"+
            "</if>"+
            "<if test=\"cathode_location != null and cathode_location != ''\">" +
            "and cathode_location like concat('%',#{cathode_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectCatHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.cathode_location,b.cathode_name,b.cathode_model,c.*,d.name as structureName from cathode_old_data as a left join cathode_config as b on a.rtu_id=b.rtu_id and a.cathode_id=b.cathode_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"cathode_id != null and cathode_id != -1\">" +
            "and b.cathode_id =#{cathode_id}"+
            "</if>"+
            "<if test=\"cathode_location != null and cathode_location != ''\">" +
            "and cathode_location like concat('%',#{cathode_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportCatHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from cathode_old_data as a left join cathode_config as b on a.rtu_id=b.rtu_id and a.cathode_id=b.cathode_id and a.rtu_channel=b.rtu_port left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"cathode_id != null and cathode_id != -1\">" +
            "and b.cathode_id =#{cathode_id}"+
            "</if>"+
            "<if test=\"cathode_location != null and cathode_location != ''\">" +
            "and cathode_location like concat('%',#{cathode_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectCatHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{cathode_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
