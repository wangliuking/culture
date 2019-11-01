package protobuf;

import net.sf.json.JSONObject;
import run.bean.RTU;
import run.bean.RtuNewDelConf;

public class TestRtuNewDelConf {

    public static JSONObject rtuNewDelConf(RTU rtu, int op) {
        RtuNewDelConf rtuNewDelConf = new RtuNewDelConf();
        rtuNewDelConf.setRtuID(rtu.getRtu_id());
        rtuNewDelConf.setOp(op);
        JSONObject jsonObject = JSONObject.fromObject(rtuNewDelConf);
        RtuNewDelConf r = (RtuNewDelConf) JSONObject.toBean(jsonObject,RtuNewDelConf.class);
        //System.out.println(r);
        return jsonObject;
    }
}
