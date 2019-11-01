package run.bean;

public class HcConfig extends MemsConfig {

    private String tempThreshold;  //温度预警阀值：上界

    private String cur_threshold;  //零线电流预警阀值

    @Override
    public String toString() {
        return "HcConfig{" +
                "tempThreshold='" + tempThreshold + '\'' +
                ", cur_threshold='" + cur_threshold + '\'' +
                ", vol_threshold='" + vol_threshold + '\'' +
                ", elecThreshold='" + elecThreshold + '\'' +
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

    private String  vol_threshold; //零线电压预警阀值

    public String getTempThreshold() {
        return tempThreshold;
    }

    public void setTempThreshold(String tempThreshold) {
        this.tempThreshold = tempThreshold;
    }

    public String getCur_threshold() {
        return cur_threshold;
    }

    public void setCur_threshold(String cur_threshold) {
        this.cur_threshold = cur_threshold;
    }

    public String getVol_threshold() {
        return vol_threshold;
    }

    public void setVol_threshold(String vol_threshold) {
        this.vol_threshold = vol_threshold;
    }

    public String getElecThreshold() {
        return elecThreshold;
    }

    public void setElecThreshold(String elecThreshold) {
        this.elecThreshold = elecThreshold;
    }

    private String elecThreshold;  //弱电流预警阀值

}
