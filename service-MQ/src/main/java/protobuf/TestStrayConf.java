package protobuf;

import net.sf.json.JSONObject;
import run.bean.Stray;
import run.bean.StrayConfig;

public class TestStrayConf {

    public static JSONObject strayConf(Stray Stray,int op) {
        StrayConfig StrayConfig = new StrayConfig();
        StrayConfig.setChanno(Stray.getRtu_port());
        StrayConfig.setBaudrate(Stray.getRtu_baud_rate());
        StrayConfig.setPolltime(Stray.getStret_space());
        StrayConfig.setMuxinterval(Stray.getStret_ospace());
        StrayConfig.setOp(op);
        if(Stray.getEquipType() == 1){
            StrayConfig.setDeviceid(Stray.getStret_id());
        }else if(Stray.getEquipType() == 2){
            StrayConfig.setDeviceid(Integer.parseInt("10"+Stray.getPortId()+"0"));
        }

        StrayConfig.setRtuID(Stray.getRtu_id());

        StrayConfig.setCalvalue(Stray.getCalvalue());
        StrayConfig.setComputeType(Stray.getComputeType());
        StrayConfig.setFactor(Stray.getFactor());
        StrayConfig.setFullscale(Stray.getFullscale());
        StrayConfig.setInnerId(Stray.getPortId());
        StrayConfig.setThreshold1(Stray.getStret_threshold1());
        StrayConfig.setThreshold2(Stray.getStret_threshold2());

        JSONObject jsonObject = JSONObject.fromObject(StrayConfig);
        StrayConfig r = (StrayConfig) JSONObject.toBean(jsonObject,StrayConfig.class);
        //System.out.println(r);
        return jsonObject;

    }
}
