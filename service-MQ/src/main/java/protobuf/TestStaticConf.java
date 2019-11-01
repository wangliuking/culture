package protobuf;

import net.sf.json.JSONObject;
import run.bean.MemsConfig;
import run.bean.Static;

public class TestStaticConf {
    public static void main(String[] args) {

    }

    public static JSONObject staticConf(Static Static,int op) {
        MemsConfig memsConfig = new MemsConfig();
        memsConfig.setChanno(Static.getRtu_port());
        memsConfig.setBaudrate(Static.getRtu_baud_rate());
        memsConfig.setPolltime(Static.getStaet_space());
        memsConfig.setMuxinterval(Static.getStaet_ospace());
        memsConfig.setThreshold1(Static.getStaet_threshold1());
        memsConfig.setThreshold2(Static.getStaet_threshold2());
        memsConfig.setOp(op);
        memsConfig.setDeviceid(Static.getStaet_id());
        memsConfig.setK(Static.getStaet_k());
        memsConfig.setV0(Static.getStaet_v0());
        memsConfig.setRtuID(Static.getRtu_id());

        JSONObject jsonObject = JSONObject.fromObject(memsConfig);
        MemsConfig r = (MemsConfig) JSONObject.toBean(jsonObject,MemsConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
