package run.mapper;

import org.apache.ibatis.annotations.*;
import run.bean.Site;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface SiteMapper {
    @Select("<script>" +
            "select a.*,b.name structureName,c.status,c.deviceNum,c.rtuNum from site_config a left join structure b on a.site_company=b.id left join site_now_data c on a.site_id=c.site_id where a.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_name != null and site_name != '' and site_name != 'null'\">" +
            "and site_name =#{site_name}"+
            "</if>"+
            "<if test=\"site_industry != null and site_industry != '' and site_industry != 'null'\">" +
            "and site_industry =#{site_industry}"+
            "</if>"+
            "<if test=\"site_province != null and site_province != '' and site_province != 'null'\">" +
            "and site_province =#{site_province}"+
            "</if>"+
            "<if test=\"site_city != null and site_city != '' and site_city != 'null'\">" +
            "and site_city =#{site_city}"+
            "</if>"+
            "<if test=\"site_county != null and site_county != '' and site_county != 'null'\">" +
            "and site_county =#{site_county}"+
            "</if>"+
            "<if test=\"site_company != null and site_company != '' and site_company != 'null'\">" +
            "and site_company =#{site_company}"+
            "</if>"+
            "order by a.site_id"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllSite(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from site_config a left join structure b on a.site_company=b.id left join site_now_data c on a.site_id=c.site_id where a.site_company in  " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_name != null and site_name != '' and site_name != 'null'\">" +
            "and site_name =#{site_name}"+
            "</if>"+
            "<if test=\"site_industry != null and site_industry != '' and site_industry != 'null'\">" +
            "and site_industry =#{site_industry}"+
            "</if>"+
            "<if test=\"site_province != null and site_province != '' and site_province != 'null'\">" +
            "and site_province =#{site_province}"+
            "</if>"+
            "<if test=\"site_city != null and site_city != '' and site_city != 'null'\">" +
            "and site_city =#{site_city}"+
            "</if>"+
            "<if test=\"site_county != null and site_county != '' and site_county != 'null'\">" +
            "and site_county =#{site_county}"+
            "</if>"+
            "<if test=\"site_company != null and site_company != '' and site_company != 'null'\">" +
            "and site_company =#{site_company}"+
            "</if>"+
            "order by a.site_id"+
            "</script>")
    int selectAllSiteCount(Map<String,Object> param);

    /*@Select("<script>" +
            "select a.*,b.name structureName from site_config a left join structure b on a.site_company=b.id where a.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_name != null and site_name != '' and site_name != 'null'\">" +
            "and site_name =#{site_name}"+
            "</if>"+
            "<if test=\"site_industry != null and site_industry != '' and site_industry != 'null'\">" +
            "and site_industry =#{site_industry}"+
            "</if>"+
            "<if test=\"site_province != null and site_province != '' and site_province != 'null'\">" +
            "and site_province =#{site_province}"+
            "</if>"+
            "<if test=\"site_city != null and site_city != '' and site_city != 'null'\">" +
            "and site_city =#{site_city}"+
            "</if>"+
            "<if test=\"site_county != null and site_county != '' and site_county != 'null'\">" +
            "and site_county =#{site_county}"+
            "</if>"+
            "<if test=\"site_company != null and site_company != '' and site_company != 'null'\">" +
            "and site_company =#{site_company}"+
            "</if>"+
            "order by site_id"+
            "</script>")
    List<Map<String,Object>> selectAllSite(Map<String,Object> param);*/

    @Select("select * from site_config where site_id = #{id}")
    Site selectSiteById(int id);

    @Insert("insert into site_config(site_name,site_industry,site_province,site_city,site_county,site_company,site_lat,site_lng,createTime) values(#{site_name},#{site_industry},#{site_province},#{site_city},#{site_county},#{site_company},#{site_lat},#{site_lng},now())")
    int insertSite(Site site);

    @Delete("delete from site_config where site_id = #{id}")
    int deleteSite(int id);

    @Update("update site_config set site_name=#{site_name},site_industry=#{site_industry},site_province=#{site_province},site_city=#{site_city},site_county=#{site_county},site_company=#{site_company},site_lat=#{site_lat},site_lng=#{site_lng},createTime=now() where site_id=#{site_id}")
    int updateSite(Site site);
}
