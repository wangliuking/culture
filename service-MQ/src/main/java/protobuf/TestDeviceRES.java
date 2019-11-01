package protobuf;

import protobuf.jsonbean.DBInfo;
import protobuf.jsonbean.DeviceRES;
import protobuf.jsonbean.Values;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class TestDeviceRES {
    public static void main(String[] args) {
        DeviceRES deviceRES = new DeviceRES();
        DBInfo dbInfo = new DBInfo();
        Values values = new Values();

        values.setIndex("1");
        values.setValue("aaa");
        List<Values> valuesList = new ArrayList<>();
        valuesList.add(values);

        dbInfo.setChanno("1");
        dbInfo.setDeviceid("1");
        dbInfo.setDevicetype("1");
        dbInfo.setRelayno("1");
        dbInfo.setTime("1");
        dbInfo.setValues(valuesList);


        deviceRES.setRespResult("www");
        deviceRES.setCallId(SendUtil.RandomWord());
        deviceRES.setRtuId("7");
        deviceRES.setDBInfo(dbInfo);
        JSONObject jsonObject = JSONObject.fromObject(deviceRES);
        System.out.println(jsonObject);
        /*Map<String,Class> classMap = new HashMap<>();
        classMap.put("DBInfo",DBInfo.class);
        classMap.put("values",Values.class);
        DeviceRES d = (DeviceRES) JSONObject.toBean(jsonObject,DeviceRES.class,classMap);
        System.out.println(d.getDBInfo().getValues().get(0).getValue());*/

    }
}
