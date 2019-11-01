package protobuf.jsonbean;

public class DAInfo {
    private String channo;
    private String devicetype;
    private String polltime;
    private String dop;
    private String fullscale;
    private String calvalue;
    private String op;

    public String getChanno() {
        return channo;
    }

    public void setChanno(String channo) {
        this.channo = channo;
    }

    public String getDevicetype() {
        return devicetype;
    }

    public void setDevicetype(String devicetype) {
        this.devicetype = devicetype;
    }

    public String getPolltime() {
        return polltime;
    }

    public void setPolltime(String polltime) {
        this.polltime = polltime;
    }

    public String getDop() {
        return dop;
    }

    public void setDop(String dop) {
        this.dop = dop;
    }

    public String getFullscale() {
        return fullscale;
    }

    public void setFullscale(String fullscale) {
        this.fullscale = fullscale;
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
        return "DAInfo{" +
                "channo='" + channo + '\'' +
                ", devicetype='" + devicetype + '\'' +
                ", polltime='" + polltime + '\'' +
                ", dop='" + dop + '\'' +
                ", fullscale='" + fullscale + '\'' +
                ", calvalue='" + calvalue + '\'' +
                ", op='" + op + '\'' +
                '}';
    }
}
