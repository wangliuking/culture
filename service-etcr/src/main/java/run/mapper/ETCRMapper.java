package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.ETCR;

import javax.swing.border.EtchedBorder;
import java.util.List;
import java.util.Map;

@Repository
public interface ETCRMapper {

    @Select("<script>" +
            "select a.*,sum(b.rst_state) rst_state,sum(b.alarm) alarm,count(b.rst_state) num,e.rtu_state from resistance_config as a left join resistance_now_data as b on a.rtu_id=b.rtu_id and a.rtu_port=b.rtu_channel and a.rst_id=b.rst_id and a.relayno=b.relayno left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.rtu_port,a.rst_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllETCR(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from ("+
            "select * from resistance_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "group by rtu_id,rtu_port,rst_id"+
            ") as a left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    int selectAllETCRCount(Map<String,Object> param);

    @Select("<script>" +
            "select * from resistance_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllRelayno(@Param("start") int start, @Param("limit") int limit, @Param("site_id") int site_id, @Param("rtu_id") int rtu_id);

    @Select("<script>" +
            "select count(*) from resistance_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    int selectAllRelaynoCount(@Param("start") int start, @Param("limit") int limit, @Param("site_id") int site_id, @Param("rtu_id") int rtu_id);

    @Insert("insert into resistance_config(site_id,rtu_id,rtu_port,rtu_baud_rate,rst_id,rst_name,rst_model,rst_location,rst_threshold,rst_type,relayno,relayno_name,rst_line_long,rst_line_radius,rst_space,rst_ospace,r1,rc) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{rst_id},#{rst_name},#{rst_model},#{rst_location},#{rst_threshold},#{rst_type},#{relayno},#{relayno_name},#{rst_line_long},#{rst_line_radius},#{rst_space},#{rst_ospace},#{r1},#{rc})")
    int insertETCR(ETCR ETCR);

    @Select("select count(*) from resistance_config where site_id = #{id}")
    int selectETCRCountBySiteId(int id);

    @Select("select * from resistance_config where rtu_id=#{rtu_id} and rst_id=#{rst_id} and rtu_port=#{rtu_port}")
    List<ETCR> selectETCRByRTUIdAndRSTId(Map<String,Object> params);

    @Delete("delete from resistance_config where site_id = #{id}")
    int deleteETCRBySite(int id);

    @Delete("delete from resistance_config where rtu_id = #{id}")
    int deleteETCRByRTU(int id);

    @Delete("delete from resistance_config where rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_port=#{rtu_port}")
    int deleteETCR(Map<String,Object> param);

    @Delete("delete from resistance_config where rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_port=#{rtu_port} and relayno=#{relayno}")
    int deleteETCRByRelayno(Map<String,Object> param);

    @Delete("delete from resistance_now_data where rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_channel=#{rtu_port} and relayno=#{relayno}")
    int deleteETCRNowByRelayno(Map<String,Object> param);

    @Update("replace into resistance_config(site_id,rtu_id,rtu_port,rtu_baud_rate,rst_id,rst_name,rst_model,rst_location,rst_threshold,rst_type,relayno,relayno_name,rst_line_long,rst_line_radius,rst_space,rst_ospace,r1,rc) values(#{site_id},#{rtu_id},#{rtu_port},#{rtu_baud_rate},#{rst_id},#{rst_name},#{rst_model},#{rst_location},#{rst_threshold},#{rst_type},#{relayno},#{relayno_name},#{rst_line_long},#{rst_line_radius},#{rst_space},#{rst_ospace},#{r1},#{rc})")
    int updateETCR(ETCR ETCR);

    @Select("select * from resistance_config where site_id = #{site_id} and rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_port=#{rtu_port}")
    ETCR selectByETCR(Map<String,Object> param);

    /**
     * 查询所有接触式电阻带继电器的
     * @param rtu_id
     * @return
     */
    @Select("select rst_id,rtu_channel from resistance_now_data where rtu_id=#{rtu_id} and rst_type is null and relayno!=0 group by rst_id,rtu_channel")
    List<Map<String,Object>> selectETCROneTypeCount(@Param("rtu_id") int rtu_id);

    /**
     * 查询单个接触式电阻带继电器的
     * @param
     * @return
     */
    @Select("select a.*,b.rst_location,b.relayno_name from resistance_now_data a left join resistance_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.rst_id=b.rst_id and a.relayno=b.relayno where a.rtu_id=#{rtu_id} and a.rst_id=#{rst_id} and a.rtu_channel=#{rtu_channel} and a.rst_type is null and a.relayno!=0")
    List<Map<String,Object>> selectETCROneType(Map<String,Object> param);

    /**
     * 查询所有接触式电阻不带继电器的
     * @param rtu_id
     * @return
     */
    @Select("select a.*,b.rst_location,b.relayno_name from resistance_now_data a left join resistance_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.rst_id=b.rst_id and a.relayno=b.relayno where a.rtu_id=#{rtu_id} and a.rst_type is null and a.relayno=0")
    List<Map<String,Object>> selectETCRTwoType(@Param("rtu_id") int rtu_id);

    /**
     * 查询所有非接触式电阻
     * @param rtu_id
     * @return
     */
    @Select("select a.*,b.rst_location from resistance_now_data a left join resistance_config b on a.rtu_id=b.rtu_id and b.rtu_port=a.rtu_channel and a.rst_id=b.rst_id and a.relayno=b.relayno where a.rtu_id=#{rtu_id} and b.rst_type=2")
    List<Map<String,Object>> selectETCRThreeType(@Param("rtu_id") int rtu_id);

    @Select("select * from resistance_now_data where relayno = #{relayno} and rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_channel=#{rtu_channel}")
    Map<String,Object> selectNowData(Map<String,Object> param);

    @Select("select * from resistance_config where rtu_id = #{rtu_id} and rst_id = #{rst_id} and rtu_port = #{rtu_port} order by relayno")
    List<ETCR> selectETCRByRTUID4RSTID(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.rst_location,b.rst_name,b.rst_model,c.*,d.name as structureName from resistance_old_data as a left join resistance_config as b on a.rtu_id=b.rtu_id and a.rst_id=b.rst_id and a.relayno=b.relayno left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"rst_id != null and rst_id != -1\">" +
            "and a.rst_id =#{rst_id}"+
            "</if>"+
            "<if test=\"rst_location != null and rst_location != ''\">" +
            "and rst_location like concat('%',#{rst_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectETCRHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.rst_location,b.rst_name,b.rst_model,c.*,d.name as structureName from resistance_old_data as a left join resistance_config as b on a.rtu_id=b.rtu_id and a.rst_id=b.rst_id and a.relayno=b.relayno left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"rst_id != null and rst_id != -1\">" +
            "and a.rst_id =#{rst_id}"+
            "</if>"+
            "<if test=\"rst_location != null and rst_location != ''\">" +
            "and rst_location like concat('%',#{rst_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportAllETCRHistoryExcel(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from resistance_old_data as a left join resistance_config as b on a.rtu_id=b.rtu_id and a.rst_id=b.rst_id and a.relayno=b.relayno left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"rst_id != null and rst_id != -1\">" +
            "and a.rst_id =#{rst_id}"+
            "</if>"+
            "<if test=\"rst_location != null and rst_location != ''\">" +
            "and rst_location like concat('%',#{rst_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectETCRHistoryCount(Map<String,Object> param);

    /**
     * 删除设备时同步删除rtu_alarm_data表相关信息
     * @param
     * @return
     */
    @Delete("delete from rtu_alarm_data where rtu_id=#{rtu_id} and rtu_channel=#{rtu_port} and devieceId=#{rst_id}")
    int deleteRTUAlarmData(Map<String,Object> param);
}
