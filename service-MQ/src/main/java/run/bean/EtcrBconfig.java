package run.bean;

import java.util.HashMap;

public class EtcrBconfig  {
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

    public int getPolltime() {
        return polltime;
    }

    public void setPolltime(int polltime) {
        this.polltime = polltime;
    }

    public int getMuxinterval() {
        return muxinterval;
    }

    public void setMuxinterval(int muxinterval) {
        this.muxinterval = muxinterval;
    }

    public String getThreshold() {
        return threshold;
    }

    public void setThreshold(String threshold) {
        this.threshold = threshold;
    }

    public String getRc() {
        return rc;
    }

    public void setRc(String rc) {
        this.rc = rc;
    }

    public String getR1() {
        return r1;
    }

    public void setR1(String r1) {
        this.r1 = r1;
    }

    public int getOp() {
        return op;
    }

    public void setOp(int op) {
        this.op = op;
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

    private int channo ; //端口号
    private int baudrate;
    private int polltime;  //查询时间，单位S
    private int muxinterval; //同串口查询时间  单位：ms
    private String threshold;  //预警阀值：10Ω
    private String rc;
    private String r1;
    private int op; //3：刪除 ； 1：新增  ；2 ：更新
    private int deviceid; //设备ID

    @Override
    public String toString() {
        return "EtcrBconfig{" +
                "channo=" + channo +
                ", baudrate=" + baudrate +
                ", polltime=" + polltime +
                ", muxinterval=" + muxinterval +
                ", threshold='" + threshold + '\'' +
                ", rc='" + rc + '\'' +
                ", r1='" + r1 + '\'' +
                ", op=" + op +
                ", deviceid=" + deviceid +
                ", rtuID=" + rtuID +
                ", alarmHash=" + alarmHash +
                '}';
    }

    private int rtuID;     //RTU ID + deviceid+ relayno 确定唯一Key

    HashMap<String ,Integer> alarmHash = new HashMap<String ,Integer>();  //alarm name, alarm status


}
