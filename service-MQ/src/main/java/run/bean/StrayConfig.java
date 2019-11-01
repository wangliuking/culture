package run.bean;

public class StrayConfig extends MemsConfig {
    private String threshold2;  //预警阀值：下界

    @Override
    public String toString() {
        return "StrayConfig{" +
                "threshold2='" + threshold2 + '\'' +
                ", threshold1='" + threshold1 + '\'' +
                ", dop='" + dop + '\'' +
                ", fullscale='" + fullscale + '\'' +
                ", calvalue='" + calvalue + '\'' +
                ", factor='" + factor + '\'' +
                ", computeType=" + computeType +
                ", innerId=" + innerId +
                ", type=" + type +
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
    protected String dop;     //精度

    @Override
    public String getThreshold2() {
        return threshold2;
    }

    @Override
    public void setThreshold2(String threshold2) {
        this.threshold2 = threshold2;
    }

    @Override
    public String getThreshold1() {
        return threshold1;
    }

    @Override
    public void setThreshold1(String threshold1) {
        this.threshold1 = threshold1;
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

    public int getComputeType() {
        return computeType;
    }

    public void setComputeType(int computeType) {
        this.computeType = computeType;
    }

    public int getInnerId() {
        return innerId;
    }

    public void setInnerId(int innerId) {
        this.innerId = innerId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    protected String fullscale;   //量程
    protected String  calvalue;    //修正值

    public String getFactor() {
        return factor;
    }

    public void setFactor(String factor) {
        this.factor = factor;
    }

    protected String  factor;    //系数

    protected int  computeType;   //计算类型：I II
    public    int   innerId;      //传感器编号
    public    int   type;         // 0:电流  1：电压

}
