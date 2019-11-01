package protobuf;

import net.sf.json.JSONObject;
import run.bean.Rsws;
import run.bean.RswsConfig;

public class TestRswsConf {

    public static JSONObject rswsConf(Rsws Rsws,int op) {
        RswsConfig rswsConfig = new RswsConfig();
        rswsConfig.setChanno(Rsws.getRtu_port());
        rswsConfig.setBaudrate(Rsws.getRtu_baud_rate());
        rswsConfig.setPolltime(Rsws.getHmt_space());
        rswsConfig.setMuxinterval(Rsws.getHmt_ospace());
        rswsConfig.setOp(op);
        rswsConfig.setDeviceid(Rsws.getHmt_id());
        rswsConfig.setRtuID(Rsws.getRtu_id());
        rswsConfig.setTempThreshold1(Rsws.getHmt_temp_threshold1());
        rswsConfig.setTempThreshold2(Rsws.getHmt_temp_threshold2());
        rswsConfig.setHumiThreshold(Rsws.getHmt_hum_threshold());

        JSONObject jsonObject = JSONObject.fromObject(rswsConfig);
        RswsConfig r = (RswsConfig) JSONObject.toBean(jsonObject,RswsConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
