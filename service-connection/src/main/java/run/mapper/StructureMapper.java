package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.Node;
import run.bean.RTU;

import java.util.List;
import java.util.Map;

@Repository
public interface StructureMapper {
    @Select("select id,pId from structure")
    List<Map<String,Integer>> foreachIdAndPId();

    @Select("<script>"+
            "select * from structure where id in "+
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    List<Node> selectAll(Map<String,Object> param);

    @Select("<script>" +
            "select * from structure where level!=0 and id in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"industry != null and industry != '' and industry != 'null'\">" +
            "and industry =#{industry}"+
            "</if>"+
            "order by id"+
            "</script>")
    List<Map<String,Object>> selectStructureList(Map<String,Object> param);

    @Select("<script>" +
            "select site_id,site_name from site_config c where c.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"industry != null and industry != '' and industry != 'null'\">" +
            "and site_industry =#{industry}"+
            "</if>"+
            "order by site_id"+
            "</script>")
    List<Map<String,Object>> selectSiteListByIndustry(Map<String,Object> param);

    @Select("<script>" +
            "select rtu_id from rtu_config as a left join site_config as b on a.site_id=b.site_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"industry != null and industry != '' and industry != 'null'\">" +
            "and site_industry =#{industry}"+
            "</if>"+
            "order by rtu_id"+
            "</script>")
    List<Map<String,Object>> selectRTUListByIndustry(Map<String,Object> param);

    @Select("<script>" +
            "select rtu_id from rtu_config as a left join site_config as b on a.site_id=b.site_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_company != null and site_company != '' and site_company != 'null'\">" +
            "and site_company =#{site_company}"+
            "</if>"+
            "order by rtu_id"+
            "</script>")
    List<Map<String,Object>> selectRTUListByCompany(Map<String,Object> param);

    @Insert("insert into structure(pId,level,name,industry) values(#{id},#{level}+1,#{name},#{industry})")
    int insert(Node node);

    @Delete("delete from structure where id = #{id} or pId = #{id}")
    int delete(int id);

    @Update("update structure set name=#{name} where id=#{id}")
    int update(Map<String,Object> param);
}
