package run.bean;

import java.util.HashMap;

public class SpdConfig {

    private int spdMap; //spd全路配置映射
    private int rtuID;     //RTU ID + deviceid+ relayno 确定唯一Key
    HashMap<String ,Integer> alarmHash = new HashMap<String ,Integer>();  //alarm name, alarm status

    public int getSpdMap() {
        return spdMap;
    }

    public void setSpdMap(int spdMap) {
        this.spdMap = spdMap;
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

    @Override
    public String toString() {
        return "SpdConfig{" +
                "spdMap=" + spdMap +
                ", rtuID=" + rtuID +
                ", alarmHash=" + alarmHash +
                '}';
    }

}
