package run.bean;

public class RswsConfig extends MemsConfig {

    public String getTempThreshold1() {
        return tempThreshold1;
    }

    public void setTempThreshold1(String tempThreshold1) {
        this.tempThreshold1 = tempThreshold1;
    }

    public String getTempThreshold2() {
        return tempThreshold2;
    }

    public void setTempThreshold2(String tempThreshold2) {
        this.tempThreshold2 = tempThreshold2;
    }

    public String getHumiThreshold() {
        return humiThreshold;
    }

    public void setHumiThreshold(String humiThreshold) {
        this.humiThreshold = humiThreshold;
    }


    @Override
    public String toString() {
        return "RswsConfig{" +
                "tempThreshold1='" + tempThreshold1 + '\'' +
                ", tempThreshold2='" + tempThreshold2 + '\'' +
                ", humiThreshold='" + humiThreshold + '\'' +
                ", channo=" + channo +
                ", baudrate=" + baudrate +
                ", polltime=" + polltime +
                ", muxinterval=" + muxinterval +
                ", op=" + op +
                ", deviceid=" + deviceid +
                ", rtuID=" + rtuID +
                ", alarmHash=" + alarmHash +
                '}';
    }

    private String tempThreshold1;  //温度预警阀值：上界
    private String tempThreshold2;  //温度预警阀值：上界
    private String humiThreshold;  //湿度预警阀值
}
