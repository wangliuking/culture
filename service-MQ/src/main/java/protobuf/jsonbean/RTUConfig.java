package protobuf.jsonbean;

import java.util.List;

public class RTUConfig {
    private String rtu_ip;
    private String rtu_port;
    private String commandType;
    private String callId;
    private String rtuId;
    private List<RS485Info> RS485InfoList;
    private List<DAInfo> DAInfoList;
    private String dipolltime;
    private String maxdbrow;
    private USERInfo userInfo;

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

    public List<RS485Info> getRS485InfoList() {
        return RS485InfoList;
    }

    public void setRS485InfoList(List<RS485Info> RS485InfoList) {
        this.RS485InfoList = RS485InfoList;
    }

    public List<DAInfo> getDAInfoList() {
        return DAInfoList;
    }

    public void setDAInfoList(List<DAInfo> DAInfoList) {
        this.DAInfoList = DAInfoList;
    }

    public String getDipolltime() {
        return dipolltime;
    }

    public void setDipolltime(String dipolltime) {
        this.dipolltime = dipolltime;
    }

    public String getMaxdbrow() {
        return maxdbrow;
    }

    public void setMaxdbrow(String maxdbrow) {
        this.maxdbrow = maxdbrow;
    }

    public USERInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(USERInfo userInfo) {
        this.userInfo = userInfo;
    }

    @Override
    public String toString() {
        return "RTUConfig{" +
                "rtu_ip='" + rtu_ip + '\'' +
                ", rtu_port='" + rtu_port + '\'' +
                ", commandType='" + commandType + '\'' +
                ", callId='" + callId + '\'' +
                ", rtuId='" + rtuId + '\'' +
                ", RS485InfoList=" + RS485InfoList +
                ", DAInfoList=" + DAInfoList +
                ", dipolltime='" + dipolltime + '\'' +
                ", maxdbrow='" + maxdbrow + '\'' +
                ", userInfo=" + userInfo +
                '}';
    }
}
