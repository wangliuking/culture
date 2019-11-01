package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.DeviceMaintain;

import java.util.List;
import java.util.Map;

@Repository
public interface DeviceMaintainMapper {

    @Select("<script>" +
            "select a.*,b.site_name from deviceMaintain as a left join site_config as b on a.site_id=b.site_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"deviceType != null and deviceType != -1\">" +
            "and deviceType =#{deviceType}"+
            "</if>"+
            "<if test=\"createTime != null and createTime != ''\">" +
            "and createTime between #{startTime} and #{endTime}"+
            "</if>"+
            "order by createTime desc"+
            "<if test=\"start != null and start != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllDeviceMaintain(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from deviceMaintain as a left join site_config as b on a.site_id=b.site_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"rtu_id != null and rtu_id != -1\">" +
            "and a.rtu_id =#{rtu_id}"+
            "</if>"+
            "<if test=\"deviceType != null and deviceType != -1\">" +
            "and deviceType =#{deviceType}"+
            "</if>"+
            "<if test=\"createTime != null and createTime != ''\">" +
            "and createTime between #{startTime} and #{endTime}"+
            "</if>"+
            "</script>")
    int selectAllDeviceMaintainCount(Map<String, Object> param);

    @Insert("insert into deviceMaintain(site_id,rtu_id,deviceType,reason,content,createTime,updateTime) values(#{site_id},#{rtu_id},#{deviceType},#{reason},#{content},now(),now())")
    int insertDeviceMaintain(DeviceMaintain deviceMaintain);

    @Delete("delete from deviceMaintain where id = #{id}")
    int deleteDeviceMaintain(int id);

    @Update("update deviceMaintain set site_id=#{site_id},rtu_id=#{rtu_id},deviceType=#{deviceType},reason=#{reason},content=#{content},updateTime=now() where id=#{id}")
    int updateDeviceMaintain(DeviceMaintain deviceMaintain);
}
