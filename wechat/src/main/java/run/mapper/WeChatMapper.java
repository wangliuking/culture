package run.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface WeChatMapper {
    /*@Select("<script>" +
            "select a.*,b.site_id from rtu_alarm_data as a left join rtu_config as b on a.rtu_id = b.rtu_id where type=2 and alarmStatus=1 "+
            "<if test=\"site_id != null and site_id != ''\">" +
            "and site_id =#{site_id}"+
            "</if>"+
            "group by a.rtu_id"+
            "</script>")
    List<Map<String,Object>> selectRTUOff(Map<String, Object> param);*/

    @Select("<script>" +
            "select * from table_list where 1=1 "+
            "<if test=\"title != null and title != ''\">" +
            "and title like concat('%',#{title},'%')"+
            "</if>"+
            "</script>")
    List<Map<String,Object>> selectAllList(Map<String, Object> param);

    @Select("<script>" +
            "select * from table_detail where 1=1 "+
            "<if test=\"id != null and id != ''\">" +
            "and id = #{id}"+
            "</if>"+
            "</script>")
    Map<String,Object> searchDetail(Map<String, Object> param);

    @Select("<script>" +
            "select * from table_news order by time desc limit 4 "+
            "</script>")
    List<Map<String,Object>> searchCurrentNews();

    @Insert("insert into click_person(openId,type,time) values (#{openId},#{type},now())")
    int insertClickNum(Map<String,Object> param);

    @Select("<script>" +
            "select * from click_person where time between #{startTime} and #{endTime}"+
            "</script>")
    List<Map<String,Object>> searchDayClickNum(Map<String,Object> param);

}
