package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.SPD;

import java.util.List;
import java.util.Map;

@Repository
public interface SPDMapper {

    @Select("<script>" +
            "select a.*,b.spd_state,count(b.spd_state) num,e.rtu_state from spd_config a left join spd_now_data b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id left join rtu_now_data e on c.rtu_id=e.rtu_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "group by a.rtu_id,a.site_id,a.spd_number"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllSPD(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from spd_config a left join spd_now_data b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join rtu_config c on a.rtu_id=c.rtu_id left join site_config d on c.site_id=d.site_id where d.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "</script>")
    int selectAllSPDCount(Map<String,Object> param);

    @Insert("insert into spd_config(site_id,rtu_id,spd_number,spd_name,spd_model,spd_location,spd_level,spd_space) values(#{site_id},#{rtu_id},#{spd_number},#{spd_name},#{spd_model},#{spd_location},#{spd_level},#{spd_space})")
    int insertSPD(SPD spd);

    @Select("select count(*) from spd_config where site_id = #{id}")
    int selectSPDCountBySite(int id);

    @Delete("delete from spd_config where site_id = #{id}")
    int deleteSPDBySite(int id);

    @Delete("delete from spd_config where rtu_id = #{id}")
    int deleteSPDByRTU(int id);

    @Delete("delete from spd_config where site_id = #{site_id} and rtu_id = #{rtu_id} and spd_number = #{spd_number}")
    int deleteSPD(@Param("site_id") int site_id, @Param("rtu_id") int rtu_id, @Param("spd_number") int spd_number);

    @Update("update spd_config set spd_name=#{spd_name},spd_model=#{spd_model},spd_location=#{spd_location},spd_level=#{spd_level},spd_space=#{spd_space} where site_id=#{site_id} and rtu_id=#{rtu_id} and spd_number=#{spd_number}")
    int updateSPD(SPD spd);

    @Select("select * from spd_config where site_id = #{site_id} and rtu_id = #{rtu_id} and spd_number = #{spd_number}")
    SPD selectBySPD(@Param("site_id") int site_id, @Param("rtu_id") int rtu_id, @Param("spd_number") int spd_number);

    @Select("select spd_number from spd_config where rtu_id = #{rtu_id}")
    List<Integer> selectByRTU(@Param("rtu_id") int rtu_id);

    @Select("select * from spd_now_data where rtu_id = #{rtu_id} order by spd_number")
    List<Map<String,Object>> selectAllSPDByRTU(@Param("rtu_id") int rtu_id);

    @Select("select count(*) from spd_config where rtu_id = #{rtu_id}")
    int selectSPDNumByRTU(@Param("rtu_id") int rtu_id);

    @Update("update spd_config set spd_map=#{spd_map} where rtu_id=#{rtu_id}")
    int updateSPDByRTU(Map<String,Object> params);

    @Select("<script>" +
            "select a.*,b.spd_location,b.spd_model,b.spd_name,c.*,d.name as structureName from spd_old_data as a left join spd_config as b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"spd_number != null and spd_number != -1\">" +
            "and b.spd_number =#{spd_number}"+
            "</if>"+
            "<if test=\"spd_location != null and spd_location != ''\">" +
            "and spd_location like concat('%',#{spd_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectSPDHistory(Map<String,Object> param);

    @Select("<script>" +
            "select a.*,b.spd_location,b.spd_model,b.spd_name,c.*,d.name as structureName from spd_old_data as a left join spd_config as b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join site_config as c on b.site_id=c.site_id left join structure as d on c.site_company=d.id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"spd_number != null and spd_number != -1\">" +
            "and b.spd_number =#{spd_number}"+
            "</if>"+
            "<if test=\"spd_location != null and spd_location != ''\">" +
            "and spd_location like concat('%',#{spd_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "order by write_time desc"+
            "</script>")
    List<Map<String,Object>> exportSPDHistory(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from spd_old_data as a left join spd_config as b on a.rtu_id=b.rtu_id and a.spd_number=b.spd_number left join site_config as c on b.site_id=c.site_id where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and b.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and b.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"spd_number != null and spd_number != -1\">" +
            "and b.spd_number =#{spd_number}"+
            "</if>"+
            "<if test=\"spd_location != null and spd_location != ''\">" +
            "and spd_location like concat('%',#{spd_location},'%')"+
            "</if>"+
            "<if test=\"startTime != null and startTime != ''\">" +
            "and write_time between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectSPDHistoryCount(Map<String,Object> param);
}
