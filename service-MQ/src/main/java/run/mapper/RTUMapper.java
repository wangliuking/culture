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
     * @param start
     * @param limit
     * @param site_id
     * @param connect_type
     * @param rtu_ip
     * @param rtu_netmask
     * @param rtu_gateway
     * @return
     */
    @Select("<script>" +
            "select b.site_name,a.* from rtu_config as a left join site_config as b on a.site_id=b.site_id where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and a.site_id =#{site_id}"+
            "</if>"+
            "<if test=\"connect_type != null and connect_type != -1\">" +
            "and connect_type =#{connect_type}"+
            "</if>"+
            "<if test=\"rtu_ip != null and rtu_ip != '' and rtu_ip != 'null'\">" +
            "and rtu_ip =#{rtu_ip}"+
            "</if>"+
            "<if test=\"rtu_netmask != null and rtu_netmask != '' and rtu_netmask != 'null'\">" +
            "and rtu_netmask =#{rtu_netmask}"+
            "</if>"+
            "<if test=\"rtu_gateway != null and rtu_gateway != '' and rtu_gateway != 'null'\">" +
            "and rtu_gateway =#{rtu_gateway}"+
            "</if>"+
            "<if test=\"start !=null and limit != null and start != -1 and limit != -1\">" +
            "limit #{start},#{limit}"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllRTU(@Param("start") int start, @Param("limit") int limit, @Param("site_id") int site_id, @Param("connect_type") int connect_type, @Param("rtu_ip") String rtu_ip, @Param("rtu_netmask") String rtu_netmask, @Param("rtu_gateway") String rtu_gateway);

    @Select("<script>" +
            "select count(*) from rtu_config where 1=1 " +
            "<if test=\"site_id != null and site_id != -1\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "<if test=\"connect_type != null and connect_type != -1\">" +
            "and connect_type =#{connect_type}"+
            "</if>"+
            "<if test=\"rtu_ip != null and rtu_ip != '' and rtu_ip != 'null'\">" +
            "and rtu_ip =#{rtu_ip}"+
            "</if>"+
            "<if test=\"rtu_netmask != null and rtu_netmask != '' and rtu_netmask != 'null'\">" +
            "and rtu_netmask =#{rtu_netmask}"+
            "</if>"+
            "<if test=\"rtu_gateway != null and rtu_gateway != '' and rtu_gateway != 'null'\">" +
            "and rtu_gateway =#{rtu_gateway}"+
            "</if>"+
            "</script>")
    int selectAllRTUCount(@Param("start") int start, @Param("limit") int limit, @Param("site_id") int site_id, @Param("connect_type") int connect_type, @Param("rtu_ip") String rtu_ip, @Param("rtu_netmask") String rtu_netmask, @Param("rtu_gateway") String rtu_gateway);

    @Select("select * from rtu_config where rtu_id = #{id}")
    RTU selectRTUById(int id);


    @Insert("insert into rtu_config(site_id,rtu_id,rtu_ip,rtu_netmask,rtu_gateway,center_ip,center_port,connect_type) values(#{site_id},#{rtu_id},#{rtu_ip},#{rtu_netmask},#{rtu_gateway},#{center_ip},#{center_port},#{connect_type})")
    int insertRTU(RTU rtu);

    @Delete("delete from rtu_config where rtu_id = #{id}")
    int deleteRTU(int id);

    @Delete("delete from rtu_config where site_id = #{id}")
    int deleteRTUBySite(int id);

    @Update("update rtu_config set site_id=#{site_id},rtu_ip=#{rtu_ip},rtu_netmask=#{rtu_netmask},rtu_gateway=#{rtu_gateway},center_ip=#{center_ip},center_port=#{center_port},connect_type=#{connect_type} where rtu_id=#{rtu_id}")
    int updateRTU(RTU rtu);
}
