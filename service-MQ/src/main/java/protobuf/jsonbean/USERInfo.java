package protobuf.jsonbean;

public class USERInfo {
    private String id;
    private String centerip;
    private String centerport;
    private String workmode;
    private String localip;
    private String localnetmask;
    private String localgw;
    private String isreboot;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCenterip() {
        return centerip;
    }

    public void setCenterip(String centerip) {
        this.centerip = centerip;
    }

    public String getCenterport() {
        return centerport;
    }

    public void setCenterport(String centerport) {
        this.centerport = centerport;
    }

    public String getWorkmode() {
        return workmode;
    }

    public void setWorkmode(String workmode) {
        this.workmode = workmode;
    }

    public String getLocalip() {
        return localip;
    }

    public void setLocalip(String localip) {
        this.localip = localip;
    }

    public String getLocalnetmask() {
        return localnetmask;
    }

    public void setLocalnetmask(String localnetmask) {
        this.localnetmask = localnetmask;
    }

    public String getLocalgw() {
        return localgw;
    }

    public void setLocalgw(String localgw) {
        this.localgw = localgw;
    }

    public String getIsreboot() {
        return isreboot;
    }

    public void setIsreboot(String isreboot) {
        this.isreboot = isreboot;
    }

    @Override
    public String toString() {
        return "USERInfo{" +
                "id='" + id + '\'' +
                ", centerip='" + centerip + '\'' +
                ", centerport='" + centerport + '\'' +
                ", workmode='" + workmode + '\'' +
                ", localip='" + localip + '\'' +
                ", localnetmask='" + localnetmask + '\'' +
                ", localgw='" + localgw + '\'' +
                ", isreboot='" + isreboot + '\'' +
                '}';
    }
}
