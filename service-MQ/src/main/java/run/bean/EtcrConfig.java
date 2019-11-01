package run.bean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class EtcrConfig {
    private int channo ; //端口号
    private int baudrate;
    private int polltime;  //查询时间，单位S
    private int muxinterval; //同串口查询时间  单位：ms
    private String threshold;  //预警阀值：10Ω
    private String length;   //辅线长度
    private String radis;  //辅线线径
    private int relayno; //继电器通道号
    private int deviceid; //设备ID
    private int rtuID;     //RTU ID + deviceid+ relayno 确定唯一Key
    private int op;

    public int getRelayno() {
        return relayno;
    }

    /*    ρ=0.0175单位Ω·mm²/m；
        数据存入方式：监测点阻值= value1值—辅助线电阻值（单位为Ω）；
        备注：设备返回值value1和value2相同，取第一个value1值；辅助线电阻值R=ρL/S，ρ=0.0175单位Ω•mm²/m，L为辅助线长度，S为辅助线线径。*/


    public int getChanno() {
        return channo;
    }

    public void setChanno(int channo) {
        this.channo = channo;
    }

    public int getBaudrate() {
        return baudrate;
    }

    public void setBaudrate(int baudrate) {
        this.baudrate = baudrate;
    }


    public int getMuxinterval() {
        return muxinterval;
    }

    public void setMuxinterval(int muxinterval) {
        this.muxinterval = muxinterval;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    public String getRadis() {
        return radis;
    }

    public void setRadis(String radis) {
        this.radis = radis;
    }

    public int getPolltime() {
        return polltime;
    }

    public void setPolltime(int polltime) {
        this.polltime = polltime;
    }

    public void setRelayno(int relayno) {
        this.relayno = relayno;
    }

    public int getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(int deviceid) {
        this.deviceid = deviceid;
    }


    public int getRtuID() {
        return rtuID;
    }

    public void setRtuID(int rtuID) {
        this.rtuID = rtuID;
    }

    public HashMap<String, Integer> getAlarmHash() {
        return alarmHash;
    }

    public void setAlarmHash(HashMap<String, Integer> alarmHash) {
        this.alarmHash = alarmHash;
    }

    HashMap<String ,Integer> alarmHash = new HashMap<String ,Integer>();  //alarm name, alarm status

    public int getOp() {
        return op;
    }

    public void setOp(int op) {
        this.op = op;
    }

    public String getThreshold() {
        return threshold;
    }

    public void setThreshold(String threshold) {
        this.threshold = threshold;
    }

    @Override
    public String toString() {
        return "EtcrConfig{" +
                "channo=" + channo +
                ", baudrate=" + baudrate +
                ", polltime=" + polltime +
                ", muxinterval=" + muxinterval +
                ", threshold='" + threshold + '\'' +
                ", length='" + length + '\'' +
                ", radis='" + radis + '\'' +
                ", relayno=" + relayno +
                ", deviceid=" + deviceid +
                ", rtuID=" + rtuID +
                ", op=" + op +
                ", alarmHash=" + alarmHash +
                '}';
    }
}
