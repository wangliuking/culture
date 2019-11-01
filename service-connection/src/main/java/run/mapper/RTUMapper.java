package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.RTU;

import java.util.List;
import java.util.Map;

@Repository
public interface RTUMapper {

    /**
     * 联合查询了rtu对应站点的名称，用map进行接受
     * @return
     */
    @Select("<script>" +
            "select b.site_name,a.*,c.rtu_state from rtu_config as a left join site_config as b on a.site_id=b.site_id left join rtu_now_data as c on a.rtu_id=c.rtu_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"connect_type != null and connect_type != -1\">" +
            "and a.connect_type =#{connect_type}"+
            "</if>"+
            "<if test=\"rtu_ip != null and rtu_ip != '' and rtu_ip != 'null'\">" +
            "and a.rtu_ip =#{rtu_ip}"+
            "</if>"+
            "<if test=\"rtu_netmask != null and rtu_netmask != '' and rtu_netmask != 'null'\">" +
            "and a.rtu_netmask =#{rtu_netmask}"+
            "</if>"+
            "<if test=\"rtu_gateway != null and rtu_gateway != '' and rtu_gateway != 'null'\">" +
            "and a.rtu_gateway =#{rtu_gateway}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllRTU(Map<String,Object> param);

    @Select("select count(*) from rtu_alarm_data where rtu_id = #{rtu_id} and type = 3")
    int selectDeviceWarningCount(@Param("rtu_id") int rtu_id);

    @Select("select *,b.rtu_state from rtu_config a left join rtu_now_data b on a.rtu_id=b.rtu_id where a.rtu_id = #{id}")
    Map<String,Object> selectRTUById(int id);

    @Select("select count(*) from rtu_config where site_id = #{site_id}")
    int selectRTUCountBySiteId(int site_id);

    @Insert("insert into rtu_config(site_id,rtu_id,rtu_ip,rtu_port,rtu_netmask,rtu_gateway,center_ip,center_port,connect_type) values(#{site_id},#{rtu_id},#{rtu_ip},#{center_port},#{rtu_netmask},#{rtu_gateway},#{center_ip},#{center_port},#{connect_type})")
    int insertRTU(RTU rtu);

    @Delete("delete from rtu_config where rtu_id = #{id}")
    int deleteRTU(int id);

    @Delete("delete from rtu_config where site_id = #{id}")
    int deleteRTUBySite(int id);

    @Update("update rtu_config set site_id=#{site_id},rtu_ip=#{rtu_ip},rtu_netmask=#{rtu_netmask},rtu_gateway=#{rtu_gateway},center_ip=#{center_ip},center_port=#{center_port},connect_type=#{connect_type} where rtu_id=#{rtu_id}")
    int updateRTU(RTU rtu);

    @Select("<script>" +
            "select a.*,b.site_name,b.site_lat,b.site_lng from rtu_config a left join site_config b on a.site_id=b.site_id where b.site_company in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "</script>")
    List<Map<String,Object>> selectAllRTUPosition(Map<String,Object> param);

    @Delete("delete from spd_config where rtu_id = #{rtu_id}")
    int delSpd(int rtu_id);

    @Delete("delete from resistance_config where rtu_id = #{rtu_id}")
    int delEtcr(int rtu_id);

    @Delete("delete from lightning_config where rtu_id = #{rtu_id}")
    int delLightning(int rtu_id);

    @Delete("delete from static_electricity_config where rtu_id = #{rtu_id}")
    int delStatic(int rtu_id);

    @Delete("delete from humiture_config where rtu_id = #{rtu_id}")
    int delRsws(int rtu_id);

    @Delete("delete from tilt_config where rtu_id = #{rtu_id}")
    int delSvt(int rtu_id);

    @Delete("delete from electrical_safety_config where rtu_id = #{rtu_id}")
    int delHc(int rtu_id);

    @Delete("delete from stray_electricity_config where rtu_id = #{rtu_id}")
    int delStray(int rtu_id);

    @Delete("delete from cathode_config where rtu_id = #{rtu_id}")
    int delCat(int rtu_id);

    @Delete("delete from rtu_alarm_data where rtu_id = #{rtu_id}")
    int delAlarmNow(int rtu_id);

    @Delete("delete from rtu_alarm_history where rtu_id = #{rtu_id}")
    int delAlarmHistory(int rtu_id);
}
