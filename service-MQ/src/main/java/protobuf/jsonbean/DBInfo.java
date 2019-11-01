package protobuf.jsonbean;

import java.util.List;

public class DBInfo {
    private String channo;
    private String deviceid;
    private String devicetype;
    private String relayno;
    private String time;
    private List<Values> values;

    public String getChanno() {
        return channo;
    }

    public void setChanno(String channo) {
        this.channo = channo;
    }

    public String getDeviceid() {
        return deviceid;
    }

    public void setDeviceid(String deviceid) {
        this.deviceid = deviceid;
    }

    public String getDevicetype() {
        return devicetype;
    }

    public void setDevicetype(String devicetype) {
        this.devicetype = devicetype;
    }

    public String getRelayno() {
        return relayno;
    }

    public void setRelayno(String relayno) {
        this.relayno = relayno;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public List<Values> getValues() {
        return values;
    }

    public void setValues(List<Values> values) {
        this.values = values;
    }

    @Override
    public String toString() {
        return "DBInfo{" +
                "channo='" + channo + '\'' +
                ", deviceid='" + deviceid + '\'' +
                ", devicetype='" + devicetype + '\'' +
                ", relayno='" + relayno + '\'' +
                ", time='" + time + '\'' +
                ", values=" + values +
                '}';
    }
}
