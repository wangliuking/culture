package protobuf;

import net.sf.json.JSONObject;
import run.bean.ETCR;
import run.bean.EtcrConfig;

public class TestETCRConf {
    public static void main(String[] args) {
        ETCR etcr = new ETCR();
        etcr.setRelayno(1);
        JSONObject jsonObject = etcrConf(etcr,1);
        System.out.println(jsonObject);
    }

    public static JSONObject etcrConf(ETCR etcr,int op) {
        EtcrConfig etcrConfig = new EtcrConfig();
        etcrConfig.setBaudrate(etcr.getRtu_baud_rate());
        etcrConfig.setChanno(etcr.getRtu_port());
        etcrConfig.setDeviceid(etcr.getRst_id());
        etcrConfig.setLength(etcr.getRst_line_long());
        etcrConfig.setMuxinterval(etcr.getRst_ospace());
        etcrConfig.setPolltime(etcr.getRst_space());
        etcrConfig.setRadis(etcr.getRst_line_radius());
        etcrConfig.setRelayno(etcr.getRelayno());
        etcrConfig.setOp(op);
        etcrConfig.setRtuID(etcr.getRtu_id());
        if(etcr.getRst_threshold() != null && !"".equals(etcr.getRst_threshold())){
            etcrConfig.setThreshold(etcr.getRst_threshold());
        }

        JSONObject jsonObject = JSONObject.fromObject(etcrConfig);
        EtcrConfig r = (EtcrConfig) JSONObject.toBean(jsonObject,EtcrConfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
