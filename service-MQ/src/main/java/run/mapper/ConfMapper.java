package run.mapper;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;
import run.bean.*;

import java.util.List;
import java.util.Map;

@Repository
public interface ConfMapper {

    @Select("select * from resistance_config where rtu_id = #{rtu_id} and rtu_port=#{rtu_port} and rst_id=#{rst_id} and relayno=#{relayno}")
    ETCR selectEtcrConf(Map<String,Object> params);

    @Select("select * from static_electricity_config where rtu_id = #{rtu_id} and rtu_port=#{rtu_port} and staet_id=#{staet_id}")
    Static selectStaticConf(Map<String,Object> params);

    @Select("select * from stray_electricity_config where rtu_id = #{rtu_id} and rtu_port=#{rtu_port} and stret_id=#{stret_id} and portId=#{portId}")
    Stray selectStrayConf(Map<String,Object> params);

    @Select("select * from cathode_config where rtu_id = #{rtu_id} and rtu_port=#{rtu_port} and cathode_id=#{cathode_id}")
    Cat selectCatConf(Map<String,Object> params);
}
