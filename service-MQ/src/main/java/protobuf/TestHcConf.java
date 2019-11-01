package protobuf;

import net.sf.json.JSONObject;
import run.bean.Hc;
import run.bean.HcConfig;

public class TestHcConf {

    public static JSONObject hcConf(Hc Hc,int op) {
        HcConfig hcConfig = new HcConfig();
        hcConfig.setChanno(Hc.getRtu_port());
        hcConfig.setBaudrate(Hc.getRtu_baud_rate());
        hcConfig.setPolltime(Hc.getEs_space());
        hcConfig.setMuxinterval(Hc.getEs_ospace());
        hcConfig.setOp(op);
        hcConfig.setDeviceid(Hc.getEs_id());
        hcConfig.setRtuID(Hc.getRtu_id());
        hcConfig.setElecThreshold(Hc.getEs_i_threshold());
        hcConfig.setTempThreshold(Hc.getEs_temp_threshold());
        hcConfig.setCur_threshold(Hc.getEs_cur_threshold());
        hcConfig.setVol_threshold(Hc.getEs_vol_threshold());

        JSONObject jsonObject = JSONObject.fromObject(hcConfig);
        HcConfig r = (HcConfig) JSONObject.toBean(jsonObject,HcConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
