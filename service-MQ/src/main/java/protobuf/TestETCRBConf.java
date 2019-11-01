package protobuf;

import net.sf.json.JSONObject;
import run.bean.ETCR;
import run.bean.EtcrBconfig;

public class TestETCRBConf {
    public static void main(String[] args) {
        
    }

    public static JSONObject etcrBConf(ETCR etcr,int op) {
        EtcrBconfig etcrBconfig = new EtcrBconfig();
        etcrBconfig.setBaudrate(etcr.getRtu_baud_rate());
        etcrBconfig.setChanno(etcr.getRtu_port());
        etcrBconfig.setDeviceid(etcr.getRst_id());
        etcrBconfig.setR1(etcr.getR1()+"");
        etcrBconfig.setMuxinterval(etcr.getRst_ospace());
        etcrBconfig.setPolltime(etcr.getRst_space());
        etcrBconfig.setRc(etcr.getRc()+"");
        etcrBconfig.setOp(op);
        etcrBconfig.setRtuID(etcr.getRtu_id());
        if(etcr.getRst_threshold() != null && !"".equals(etcr.getRst_threshold())){
            etcrBconfig.setThreshold(etcr.getRst_threshold());
        }

        JSONObject jsonObject = JSONObject.fromObject(etcrBconfig);
        EtcrBconfig r = (EtcrBconfig) JSONObject.toBean(jsonObject,EtcrBconfig.class);
        //System.out.println(r);
        return jsonObject;
    }
}
