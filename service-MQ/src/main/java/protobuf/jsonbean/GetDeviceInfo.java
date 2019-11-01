package protobuf.jsonbean;

public class GetDeviceInfo {
    private String rtu_ip;
    private String rtu_port;
    private String commandType;
    private String callId;
    private String rtuId;
    private QueryDevices queryDevices;

    public String getRtu_ip() {
        return rtu_ip;
    }

    public void setRtu_ip(String rtu_ip) {
        this.rtu_ip = rtu_ip;
    }

    public String getRtu_port() {
        return rtu_port;
    }

    public void setRtu_port(String rtu_port) {
        this.rtu_port = rtu_port;
    }

    public String getCommandType() {
        return commandType;
    }

    public void setCommandType(String commandType) {
        this.commandType = commandType;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getRtuId() {
        return rtuId;
    }

    public void setRtuId(String rtuId) {
        this.rtuId = rtuId;
    }

    public QueryDevices getQueryDevices() {
        return queryDevices;
    }

    public void setQueryDevices(QueryDevices queryDevices) {
        this.queryDevices = queryDevices;
    }

    @Override
    public String toString() {
        return "GetDeviceInfo{" +
                "rtu_ip='" + rtu_ip + '\'' +
                ", rtu_port='" + rtu_port + '\'' +
                ", commandType='" + commandType + '\'' +
                ", callId='" + callId + '\'' +
                ", rtuId='" + rtuId + '\'' +
                ", queryDevices=" + queryDevices +
                '}';
    }
}
