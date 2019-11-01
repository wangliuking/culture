package run.bean;

public class Svt {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int tilt_id;
    private String tilt_name;
    private String tilt_model;
    private String tilt_location;
    private String tilt_threshold1;
    private String tilt_threshold2;
    private int tilt_space;
    private int tilt_ospace;

    public int getSite_id() {
        return site_id;
    }

    public void setSite_id(int site_id) {
        this.site_id = site_id;
    }

    public int getRtu_id() {
        return rtu_id;
    }

    public void setRtu_id(int rtu_id) {
        this.rtu_id = rtu_id;
    }

    public int getRtu_port() {
        return rtu_port;
    }

    public void setRtu_port(int rtu_port) {
        this.rtu_port = rtu_port;
    }

    public int getRtu_baud_rate() {
        return rtu_baud_rate;
    }

    public void setRtu_baud_rate(int rtu_baud_rate) {
        this.rtu_baud_rate = rtu_baud_rate;
    }

    public int getTilt_id() {
        return tilt_id;
    }

    public void setTilt_id(int tilt_id) {
        this.tilt_id = tilt_id;
    }

    public String getTilt_name() {
        return tilt_name;
    }

    public void setTilt_name(String tilt_name) {
        this.tilt_name = tilt_name;
    }

    public String getTilt_model() {
        return tilt_model;
    }

    public void setTilt_model(String tilt_model) {
        this.tilt_model = tilt_model;
    }

    public String getTilt_location() {
        return tilt_location;
    }

    public void setTilt_location(String tilt_location) {
        this.tilt_location = tilt_location;
    }

    public String getTilt_threshold1() {
        return tilt_threshold1;
    }

    public void setTilt_threshold1(String tilt_threshold1) {
        this.tilt_threshold1 = tilt_threshold1;
    }

    public String getTilt_threshold2() {
        return tilt_threshold2;
    }

    public void setTilt_threshold2(String tilt_threshold2) {
        this.tilt_threshold2 = tilt_threshold2;
    }

    public int getTilt_space() {
        return tilt_space;
    }

    public void setTilt_space(int tilt_space) {
        this.tilt_space = tilt_space;
    }

    public int getTilt_ospace() {
        return tilt_ospace;
    }

    public void setTilt_ospace(int tilt_ospace) {
        this.tilt_ospace = tilt_ospace;
    }

    @Override
    public String toString() {
        return "Svt{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", tilt_id=" + tilt_id +
                ", tilt_name='" + tilt_name + '\'' +
                ", tilt_model='" + tilt_model + '\'' +
                ", tilt_location='" + tilt_location + '\'' +
                ", tilt_threshold1='" + tilt_threshold1 + '\'' +
                ", tilt_threshold2='" + tilt_threshold2 + '\'' +
                ", tilt_space=" + tilt_space +
                ", tilt_ospace=" + tilt_ospace +
                '}';
    }
}
