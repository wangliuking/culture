package protobuf;

import net.sf.json.JSONObject;
import run.bean.Svt;
import run.bean.SvtConfig;

public class TestSvtConf {

    public static JSONObject svtConf(Svt Svt,int op) {
        SvtConfig SvtConfig = new SvtConfig();
        SvtConfig.setChanno(Svt.getRtu_port());
        SvtConfig.setBaudrate(Svt.getRtu_baud_rate());
        SvtConfig.setPolltime(Svt.getTilt_space());
        SvtConfig.setMuxinterval(Svt.getTilt_ospace());
        SvtConfig.setOp(op);
        SvtConfig.setDeviceid(Svt.getTilt_id());
        SvtConfig.setRtuID(Svt.getRtu_id());
        SvtConfig.setThreshold1(Svt.getTilt_threshold1());
        SvtConfig.setThreshold2(Svt.getTilt_threshold2());

        JSONObject jsonObject = JSONObject.fromObject(SvtConfig);
        SvtConfig r = (SvtConfig) JSONObject.toBean(jsonObject,SvtConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
