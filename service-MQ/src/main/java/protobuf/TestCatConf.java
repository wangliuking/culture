package protobuf;

import net.sf.json.JSONObject;
import run.bean.Cat;
import run.bean.CathodeConfig;

public class TestCatConf {

    public static JSONObject catConf(Cat Cat,int op) {
        CathodeConfig CathodeConfig = new CathodeConfig();
        CathodeConfig.setChanno(Cat.getRtu_port());
        CathodeConfig.setBaudrate(Cat.getRtu_baud_rate());
        CathodeConfig.setPolltime(Cat.getCathode_space());
        CathodeConfig.setMuxinterval(Cat.getCathode_ospace());
        CathodeConfig.setOp(op);
        if(Cat.getCathode_id() != 0){
            CathodeConfig.setDeviceid(Cat.getCathode_id());
        }else if(Cat.getCathode_id() == 0){
            CathodeConfig.setDeviceid(Integer.parseInt("20"+Cat.getRtu_port()+"0"));
        }

        CathodeConfig.setRtuID(Cat.getRtu_id());

        CathodeConfig.setCalvalue(Cat.getCalvalue());
        CathodeConfig.setComputeType(Cat.getComputeType());
        CathodeConfig.setFactor(Cat.getFactor());
        CathodeConfig.setFullscale(Cat.getFullscale());
        CathodeConfig.setThreshold1(Cat.getCathode_threshold1());
        CathodeConfig.setThreshold2(Cat.getCathode_threshold2());

        JSONObject jsonObject = JSONObject.fromObject(CathodeConfig);
        CathodeConfig r = (CathodeConfig) JSONObject.toBean(jsonObject,CathodeConfig.class);
        //System.out.println(r);
        return jsonObject;

    }
}
