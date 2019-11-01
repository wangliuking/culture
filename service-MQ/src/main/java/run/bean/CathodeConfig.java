package run.bean;

public class CathodeConfig extends MemsConfig {

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


    @Override
    public String toString() {
        return "CathodeConfig{" +
                "threshold1='" + threshold1 + '\'' +
                ", threshold2='" + threshold2 + '\'' +
                ", dop='" + dop + '\'' +
                ", fullscale='" + fullscale + '\'' +
                ", calvalue='" + calvalue + '\'' +
                ", factor='" + factor + '\'' +
                ", computeType=" + computeType +
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
    private String threshold2;  //预警阀值：下界
    protected String dop;     //精度

    protected String fullscale;   //量程
    protected String  calvalue;    //修正值

    public String getFactor() {
        return factor;
    }

    public void setFactor(String factor) {
        this.factor = factor;
    }

    protected String factor;  //系数

    public int getComputeType() {
        return computeType;
    }

    public void setComputeType(int computeType) {
        this.computeType = computeType;
    }

    protected int  computeType;   //计算类型：I II

}
