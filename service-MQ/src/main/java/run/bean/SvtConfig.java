package run.bean;

public class SvtConfig extends MemsConfig {

    @Override
    public String toString() {
        return "SvtConfig{" +
                "threshold1='" + threshold1 + '\'' +
                ", threshold2='" + threshold2 + '\'' +
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

    private String threshold1;  //预警阀值：上界

    @Override
    public String getThreshold1() {
        return threshold1;
    }

    @Override
    public void setThreshold1(String threshold1) {
        this.threshold1 = threshold1;
    }

    @Override
    public String getThreshold2() {
        return threshold2;
    }

    @Override
    public void setThreshold2(String threshold2) {
        this.threshold2 = threshold2;
    }

    private String threshold2;  //预警阀值：下界


}
