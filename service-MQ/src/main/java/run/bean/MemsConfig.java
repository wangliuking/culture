package run.bean;

import java.util.HashMap;

public class MemsConfig {
    protected int channo ; //端口号
    protected int baudrate;
    protected int polltime;  //查询时间，单位S
    protected int muxinterval; //同串口查询时间  单位：ms
    private String threshold1;  //预警阀值：上界
    private String threshold2;  //预警阀值：下界
    protected int op; //3：刪除 ； 1：新增  ；2 ：更新
    protected int deviceid; //设备ID

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

    public String getThreshold1() {
        return threshold1;
    }

    public void setThreshold1(String threshold1) {
        this.threshold1 = threshold1;
    }

    public String getThreshold2() {
        return threshold2;
    }

    public void setThreshold2(String threshold2) {
        this.threshold2 = threshold2;
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

    public String getK() {
        return k;
    }

    public void setK(String k) {
        this.k = k;
    }

    public String getV0() {
        return v0;
    }

    public void setV0(String v0) {
        this.v0 = v0;
    }

    public HashMap<String, Integer> getAlarmHash() {
        return alarmHash;
    }

    public void setAlarmHash(HashMap<String, Integer> alarmHash) {
        this.alarmHash = alarmHash;
    }

    protected int rtuID;

    @Override
    public String toString() {
        return "MemsConfig{" +
                "channo=" + channo +
                ", baudrate=" + baudrate +
                ", polltime=" + polltime +
                ", muxinterval=" + muxinterval +
                ", threshold1='" + threshold1 + '\'' +
                ", threshold2='" + threshold2 + '\'' +
                ", op=" + op +
                ", deviceid=" + deviceid +
                ", rtuID=" + rtuID +
                ", k='" + k + '\'' +
                ", v0='" + v0 + '\'' +
                ", alarmHash=" + alarmHash +
                '}';
    }

    private String k;
    private String v0;

    protected  HashMap<String ,Integer> alarmHash = new HashMap<String ,Integer>();  //alarm name, alarm status

}
