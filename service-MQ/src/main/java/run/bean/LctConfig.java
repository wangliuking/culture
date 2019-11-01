package run.bean;

import java.util.HashMap;

public class LctConfig {
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

    public int getLtn_times() {
        return ltn_times;
    }

    public void setLtn_times(int ltn_times) {
        this.ltn_times = ltn_times;
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
    private String threshold1;  //预警阀值：上界
    private String threshold2;  //预警阀值：下界
    private int ltn_times;  //预警阈值次数
    private int op; //3：刪除 ； 1：新增  ；2 ：更新
    private int deviceid; //设备ID
    private int rtuID;

    public int getThresholsCount() {
        return thresholsCount;
    }

    public void setThresholsCount(int thresholsCount) {
        this.thresholsCount = thresholsCount;
    }

    @Override
    public String toString() {
        return "LctConfig{" +
                "channo=" + channo +
                ", baudrate=" + baudrate +
                ", polltime=" + polltime +
                ", muxinterval=" + muxinterval +
                ", threshold1='" + threshold1 + '\'' +
                ", threshold2='" + threshold2 + '\'' +
                ", ltn_times=" + ltn_times +
                ", op=" + op +
                ", deviceid=" + deviceid +
                ", rtuID=" + rtuID +
                ", thresholsCount=" + thresholsCount +
                ", alarmHash=" + alarmHash +
                '}';
    }

    private  int thresholsCount;  //预警阈值统计

    HashMap<String ,Integer> alarmHash = new HashMap<String ,Integer>();  //alarm name, alarm status





}
