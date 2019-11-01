package run.bean;

public class RtuNewDelConf {

    public int getRtuID() {
        return rtuID;
    }

    public void setRtuID(int rtuID) {
        this.rtuID = rtuID;
    }

    public int getOp() {
        return op;
    }

    public void setOp(int op) {
        this.op = op;
    }

    @Override
    public String toString() {
        return "RtuNewDelConf{" +
                "rtuID=" + rtuID +
                ", op=" + op +
                '}';
    }

    private int rtuID;     //RTU ID + deviceid+ relayno 确定唯一Key

    private int op; //3：刪除 ； 1：新增  ；2 ：更新


}
