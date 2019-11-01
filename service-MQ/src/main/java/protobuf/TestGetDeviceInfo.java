package protobuf;

import protobuf.jsonbean.GetDeviceInfo;
import protobuf.jsonbean.QueryDevices;
import net.sf.json.JSONObject;
import run.bean.ETCR;
import run.bean.RTU;

import java.util.Map;

public class TestGetDeviceInfo {
    public static void main(String[] args) {
        /*RTU rtu = new RTU();
        rtu.setRtu_id(8);
        rtu.setRtu_ip("192.168.8.107");
        rtu.setCenter_port(60005);

        ETCR etcr = new ETCR();
        etcr.setRtu_port(8);
        etcr.setRst_id(8);
        System.out.println(getDeviceInfo(rtu,etcr));

        try {
            SendUtil.sendMQ(getDeviceInfo(rtu,etcr),Conf.ip_port,Conf.w2z_MQ);
        }catch (Exception e){
            e.printStackTrace();
        }*/

    }
    public static JSONObject getDeviceInfo(RTU rtu, Map<String,Object> params) {
        GetDeviceInfo getDeviceInfo = new GetDeviceInfo();
        QueryDevices queryDevices = new QueryDevices();
        queryDevices.setTtys_n(params.get("channo")+"");
        queryDevices.setDeviceId(params.get("deviceId")+"");

        getDeviceInfo.setRtu_ip(rtu.getRtu_ip());
        getDeviceInfo.setRtu_port(rtu.getCenter_port()+"");
        getDeviceInfo.setCommandType("3");
        getDeviceInfo.setCallId(SendUtil.RandomWord());
        getDeviceInfo.setRtuId(rtu.getRtu_id()+"");
        getDeviceInfo.setQueryDevices(queryDevices);

        JSONObject jsonObject = JSONObject.fromObject(getDeviceInfo);
        //System.out.println(jsonObject);

        /*Map<String,Class> classMap = new HashMap<>();
        classMap.put("queryDevices",QueryDevices.class);
        GetDeviceInfo g = (GetDeviceInfo)JSONObject.toBean(jsonObject,GetDeviceInfo.class,classMap);
        System.out.println(g.getQueryDevices().getDeviceid());*/
        return jsonObject;
    }
}
