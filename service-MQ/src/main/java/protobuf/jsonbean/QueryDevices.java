package protobuf.jsonbean;

public class QueryDevices {
    private String ttys_n;
    private String deviceId;

    public String getTtys_n() {
        return ttys_n;
    }

    public void setTtys_n(String ttys_n) {
        this.ttys_n = ttys_n;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    @Override
    public String toString() {
        return "QueryDevices{" +
                "ttys_n='" + ttys_n + '\'' +
                ", deviceId='" + deviceId + '\'' +
                '}';
    }
}
