package protobuf.jsonbean;

public class RS485Info {
    private String channo;
    private String deviceid;
    private String devicetype;
    private String baudrate;
    private String polltime;
    private String muxinterval;
    private String calvalue;
    private String op;

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

    public String getBaudrate() {
        return baudrate;
    }

    public void setBaudrate(String baudrate) {
        this.baudrate = baudrate;
    }

    public String getPolltime() {
        return polltime;
    }

    public void setPolltime(String polltime) {
        this.polltime = polltime;
    }

    public String getMuxinterval() {
        return muxinterval;
    }

    public void setMuxinterval(String muxinterval) {
        this.muxinterval = muxinterval;
    }

    public String getCalvalue() {
        return calvalue;
    }

    public void setCalvalue(String calvalue) {
        this.calvalue = calvalue;
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    @Override
    public String toString() {
        return "RS485Info{" +
                "channo='" + channo + '\'' +
                ", deviceid='" + deviceid + '\'' +
                ", devicetype='" + devicetype + '\'' +
                ", baudrate='" + baudrate + '\'' +
                ", polltime='" + polltime + '\'' +
                ", muxinterval='" + muxinterval + '\'' +
                ", calvalue='" + calvalue + '\'' +
                ", op='" + op + '\'' +
                '}';
    }
}
