package protobuf;

import protobuf.jsonbean.DAInfo;
import protobuf.jsonbean.RS485Info;
import protobuf.jsonbean.RTUConfig;
import protobuf.jsonbean.USERInfo;
import net.sf.json.JSONObject;
import run.bean.*;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestRTUConf {
    public static void main(String[] args) {

    }

    public static JSONObject rtuConf(RTU rtu) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        /*RS485Info rs485Info = new RS485Info();
        rs485InfoList.add(rs485Info);*/
        //DAInfo
        /*DAInfo daInfo = new DAInfo();
        daInfoList.add(daInfo);*/
        //USERInfo
        USERInfo userInfo = new USERInfo();
        userInfo.setId(rtu.getRtu_id()+"");
        userInfo.setCenterip(rtu.getCenter_ip());
        userInfo.setCenterport(rtu.getCenter_port()+"");
        userInfo.setWorkmode(rtu.getConnect_type()+"");
        userInfo.setLocalip(rtu.getRtu_ip());
        userInfo.setLocalnetmask(rtu.getRtu_netmask());
        userInfo.setLocalgw(rtu.getRtu_gateway());
        userInfo.setIsreboot("1");

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(rtu.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, SPD spd) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        //RS485Info rs485Info = new RS485Info();
        //rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();
        /*userInfo.setId(rtu.getRtu_id()+"");
        userInfo.setCenterip(rtu.getCenter_ip());
        userInfo.setCenterport(rtu.getCenter_port()+"");
        userInfo.setWorkmode(rtu.getConnect_type()+"");
        userInfo.setLocalip(rtu.getRtu_ip());
        userInfo.setLocalnetmask(rtu.getRtu_netmask());
        userInfo.setLocalgw(rtu.getRtu_gateway());
        userInfo.setIsreboot("0");*/

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        String serialNumber = SendUtil.RandomWord();
        System.out.println("serialNumber ： "+serialNumber);

        rtuConfig.setCallId(serialNumber);
        rtuConfig.setRtuId(rtu.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime(spd.getSpd_space()+"");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, ETCR etcr, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(etcr.getRtu_port()+"");
        rs485Info.setDeviceid(etcr.getRst_id()+"");
        rs485Info.setDevicetype(etcr.getRst_type()+"");
        rs485Info.setBaudrate(etcr.getRtu_baud_rate()+"");
        rs485Info.setPolltime(etcr.getRst_space()+"");
        rs485Info.setMuxinterval(etcr.getRst_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(etcr.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Lightning lightning, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(lightning.getRtu_port()+"");
        rs485Info.setDeviceid(lightning.getLtn_id()+"");
        rs485Info.setDevicetype("2");
        rs485Info.setBaudrate(lightning.getRtu_baud_rate()+"");
        rs485Info.setPolltime(lightning.getLtn_space()+"");
        rs485Info.setMuxinterval(lightning.getLtn_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(lightning.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Static Static, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(Static.getRtu_port()+"");
        rs485Info.setDeviceid(Static.getStaet_id()+"");
        rs485Info.setDevicetype("4");
        rs485Info.setBaudrate(Static.getRtu_baud_rate()+"");
        rs485Info.setPolltime(Static.getStaet_space()+"");
        rs485Info.setMuxinterval(Static.getStaet_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(Static.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Rsws rsws, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(rsws.getRtu_port()+"");
        rs485Info.setDeviceid(rsws.getHmt_id()+"");
        rs485Info.setDevicetype("3");
        rs485Info.setBaudrate(rsws.getRtu_baud_rate()+"");
        rs485Info.setPolltime(rsws.getHmt_space()+"");
        rs485Info.setMuxinterval(rsws.getHmt_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(rsws.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Svt svt, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(svt.getRtu_port()+"");
        rs485Info.setDeviceid(svt.getTilt_id()+"");
        rs485Info.setDevicetype("5");
        rs485Info.setBaudrate(svt.getRtu_baud_rate()+"");
        rs485Info.setPolltime(svt.getTilt_space()+"");
        rs485Info.setMuxinterval(svt.getTilt_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(svt.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Hc hc, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        RS485Info rs485Info = new RS485Info();
        rs485Info.setChanno(hc.getRtu_port()+"");
        rs485Info.setDeviceid(hc.getEs_id()+"");
        rs485Info.setDevicetype("6");
        rs485Info.setBaudrate(hc.getRtu_baud_rate()+"");
        rs485Info.setPolltime(hc.getEs_space()+"");
        rs485Info.setMuxinterval(hc.getEs_ospace()+"");
        rs485Info.setCalvalue("0");
        rs485Info.setOp(op);
        rs485InfoList.add(rs485Info);
        //DAInfo
        //DAInfo daInfo = new DAInfo();
        //daInfoList.add(daInfo);
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(hc.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }

    public static JSONObject rtuConf(RTU rtu, Stray stray, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        if(stray.getEquipType() == 1){
            RS485Info rs485Info = new RS485Info();
            rs485Info.setChanno(stray.getRtu_port()+"");
            rs485Info.setDeviceid(stray.getStret_id()+"");
            rs485Info.setDevicetype("7");
            rs485Info.setBaudrate(stray.getRtu_baud_rate()+"");
            rs485Info.setPolltime(stray.getStret_space()+"");
            rs485Info.setMuxinterval(stray.getStret_ospace()+"");
            rs485Info.setCalvalue("0");
            rs485Info.setOp(op);
            rs485InfoList.add(rs485Info);
        }
        //DAInfo
        if(stray.getEquipType() == 2){
            DAInfo daInfo = new DAInfo();
            daInfo.setChanno(stray.getRtu_port()+"");
            daInfo.setPolltime(stray.getStret_space()+"");
            daInfo.setOp(op);
            daInfoList.add(daInfo);
        }
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(stray.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }


    public static JSONObject rtuConf(RTU rtu, Cat cat, String op) {
        RTUConfig rtuConfig = new RTUConfig();
        List<RS485Info> rs485InfoList = new ArrayList<>();
        List<DAInfo> daInfoList = new ArrayList<>();
        //RS485
        if(cat.getCathode_id() != 0){
            RS485Info rs485Info = new RS485Info();
            rs485Info.setChanno(cat.getRtu_port()+"");
            rs485Info.setDeviceid(cat.getCathode_id()+"");
            rs485Info.setDevicetype("8");
            rs485Info.setBaudrate(cat.getRtu_baud_rate()+"");
            rs485Info.setPolltime(cat.getCathode_space()+"");
            rs485Info.setMuxinterval(cat.getCathode_ospace()+"");
            rs485Info.setCalvalue("0");
            rs485Info.setOp(op);
            rs485InfoList.add(rs485Info);
        }
        //DAInfo
        if(cat.getCathode_id() == 0){
            DAInfo daInfo = new DAInfo();
            daInfo.setChanno(cat.getRtu_port()+"");
            daInfo.setPolltime(cat.getCathode_space()+"");
            daInfo.setOp(op);
            daInfoList.add(daInfo);
        }
        //USERInfo
        //USERInfo userInfo = new USERInfo();

        rtuConfig.setRtu_ip(rtu.getRtu_ip());
        rtuConfig.setRtu_port(rtu.getCenter_port()+"");
        rtuConfig.setCommandType("2");
        rtuConfig.setCallId(SendUtil.RandomWord());
        rtuConfig.setRtuId(cat.getRtu_id()+"");
        rtuConfig.setRS485InfoList(rs485InfoList);
        rtuConfig.setDAInfoList(daInfoList);
        //数字输入
        rtuConfig.setDipolltime("");
        rtuConfig.setMaxdbrow("");
        //rtuConfig.setUserInfo(userInfo);

        JSONObject jsonObject = JSONObject.fromObject(rtuConfig);
        //System.out.println(jsonObject);


        Map<String,Class> classMap = new HashMap<>();
        classMap.put("RS485InfoList", RS485Info.class);
        classMap.put("DAInfoList", DAInfo.class);
        classMap.put("userInfo", USERInfo.class);

        RTUConfig r = (RTUConfig) JSONObject.toBean(jsonObject,RTUConfig.class,classMap);
        //System.out.println(r.getRS485InfoList().get(0).getDeviceid());
        //System.out.println(r.getDAInfoList().get(0).getDevicetype());
        //System.out.println(r.getUserInfo().getCenterip());

        return jsonObject;
    }
}
