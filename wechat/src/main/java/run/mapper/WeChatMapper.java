package run.mapper;

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

}
