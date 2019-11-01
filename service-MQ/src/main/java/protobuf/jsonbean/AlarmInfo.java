package protobuf.jsonbean;

public class AlarmInfo {
    private int alarmType;
    private int channo;
    private int deviceid;
    private int devicetype;
    private int relayno;
    private int rtuId;
    private int status;
    private int dealStatus;
    private String alarmStr;
    private String time;

    public int getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(int alarmType) {
        this.alarmType = alarmType;
    }

    public int getChanno() {
        return channo;
    }

    public void setChanno(int channo) {
        this.channo = channo;
    }

    public int getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(int deviceid) {
        this.deviceid = deviceid;
    }

    public int getDevicetype() {
        return devicetype;
    }

    public void setDevicetype(int devicetype) {
        this.devicetype = devicetype;
    }

    public int getRelayno() {
        return relayno;
    }

    public void setRelayno(int relayno) {
        this.relayno = relayno;
    }

    public int getRtuId() {
        return rtuId;
    }

    public void setRtuId(int rtuId) {
        this.rtuId = rtuId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getDealStatus() {
        return dealStatus;
    }

    public void setDealStatus(int dealStatus) {
        this.dealStatus = dealStatus;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getAlarmStr() {
        return alarmStr;
    }

    public void setAlarmStr(String alarmStr) {
        this.alarmStr = alarmStr;
    }

    @Override
    public String toString() {
        return "AlarmInfo{" +
                "alarmType=" + alarmType +
                ", channo=" + channo +
                ", deviceid=" + deviceid +
                ", devicetype=" + devicetype +
                ", relayno=" + relayno +
                ", rtuId=" + rtuId +
                ", status=" + status +
                ", dealStatus=" + dealStatus +
                ", alarmStr='" + alarmStr + '\'' +
                ", time='" + time + '\'' +
                '}';
    }
}
