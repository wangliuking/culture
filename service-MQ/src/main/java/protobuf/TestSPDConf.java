package protobuf;

import net.sf.json.JSONObject;
import run.bean.SPD;
import run.bean.SpdConfig;

public class TestSPDConf {
    public static void main(String[] args) {
        /*JSONObject jsonObject = spdConf();
        System.out.println(jsonObject);*/
    }

    public static JSONObject spdConf(SPD spd) {
        SpdConfig spdConfig = new SpdConfig();
        spdConfig.setRtuID(spd.getRtu_id());
        spdConfig.setSpdMap(spd.getSpd_map());
        JSONObject jsonObject = JSONObject.fromObject(spdConfig);
        SpdConfig r = (SpdConfig) JSONObject.toBean(jsonObject,SpdConfig.class);
        System.out.println(r);
        return jsonObject;
    }
}
