package protobuf;

import net.sf.json.JSONObject;
import run.bean.Lightning;
import run.bean.LctConfig;

public class TestLightningConf {
    public static void main(String[] args) {

    }

    public static JSONObject lightningConf(Lightning lightning,int op) {
        LctConfig lctConfig = new LctConfig();
        lctConfig.setChanno(lightning.getRtu_port());
        lctConfig.setBaudrate(lightning.getRtu_baud_rate());
        lctConfig.setPolltime(lightning.getLtn_space());
        lctConfig.setMuxinterval(lightning.getLtn_ospace());
        lctConfig.setThreshold1(lightning.getLtn_threshold1());
        lctConfig.setThreshold2(lightning.getLtn_threshold2());
        lctConfig.setLtn_times(lightning.getLtn_times());
        lctConfig.setOp(op);
        lctConfig.setDeviceid(lightning.getLtn_id());
        lctConfig.setRtuID(lightning.getRtu_id());

        JSONObject jsonObject = JSONObject.fromObject(lctConfig);
        LctConfig r = (LctConfig) JSONObject.toBean(jsonObject,LctConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
