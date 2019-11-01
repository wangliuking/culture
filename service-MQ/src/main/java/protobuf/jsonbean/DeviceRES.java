package protobuf.jsonbean;

public class DeviceRES {
    private String RespResult;
    private String callId;
    private String rtuId ;

    @Override
    public String toString() {
        return "DeviceRES{" +
                "RespResult='" + RespResult + '\'' +
                ", callId='" + callId + '\'' +
                ", rtuId='" + rtuId + '\'' +
                ", DBInfo=" + DBInfo +
                ", fragsequence='" + fragsequence + '\'' +
                '}';
    }

    private DBInfo DBInfo;

    public String getFragsequence() {
        return fragsequence;
    }

    public void setFragsequence(String fragsequence) {
        this.fragsequence = fragsequence;
    }

    private String fragsequence;

    public String getRespResult() {
        return RespResult;
    }

    public void setRespResult(String respResult) {
        this.RespResult = respResult;
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

    public DBInfo getDBInfo() {
        return DBInfo;
    }

    public void setDBInfo(DBInfo DBInfo) {
        this.DBInfo = DBInfo;
    }


}
