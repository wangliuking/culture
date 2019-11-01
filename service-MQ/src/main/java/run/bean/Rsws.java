package run.bean;

public class Rsws {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int hmt_id;
    private String hmt_name;
    private String hmt_model;
    private String hmt_location;
    private String hmt_temp_threshold1;
    private String hmt_temp_threshold2;
    private String hmt_hum_threshold;
    private int hmt_space;
    private int hmt_ospace;

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

    public int getHmt_id() {
        return hmt_id;
    }

    public void setHmt_id(int hmt_id) {
        this.hmt_id = hmt_id;
    }

    public String getHmt_name() {
        return hmt_name;
    }

    public void setHmt_name(String hmt_name) {
        this.hmt_name = hmt_name;
    }

    public String getHmt_model() {
        return hmt_model;
    }

    public void setHmt_model(String hmt_model) {
        this.hmt_model = hmt_model;
    }

    public String getHmt_location() {
        return hmt_location;
    }

    public void setHmt_location(String hmt_location) {
        this.hmt_location = hmt_location;
    }

    public String getHmt_temp_threshold1() {
        return hmt_temp_threshold1;
    }

    public void setHmt_temp_threshold1(String hmt_temp_threshold1) {
        this.hmt_temp_threshold1 = hmt_temp_threshold1;
    }

    public String getHmt_temp_threshold2() {
        return hmt_temp_threshold2;
    }

    public void setHmt_temp_threshold2(String hmt_temp_threshold2) {
        this.hmt_temp_threshold2 = hmt_temp_threshold2;
    }

    public String getHmt_hum_threshold() {
        return hmt_hum_threshold;
    }

    public void setHmt_hum_threshold(String hmt_hum_threshold) {
        this.hmt_hum_threshold = hmt_hum_threshold;
    }

    public int getHmt_space() {
        return hmt_space;
    }

    public void setHmt_space(int hmt_space) {
        this.hmt_space = hmt_space;
    }

    public int getHmt_ospace() {
        return hmt_ospace;
    }

    public void setHmt_ospace(int hmt_ospace) {
        this.hmt_ospace = hmt_ospace;
    }

    @Override
    public String toString() {
        return "Rsws{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", hmt_id=" + hmt_id +
                ", hmt_name='" + hmt_name + '\'' +
                ", hmt_model='" + hmt_model + '\'' +
                ", hmt_location='" + hmt_location + '\'' +
                ", hmt_temp_threshold1='" + hmt_temp_threshold1 + '\'' +
                ", hmt_temp_threshold2='" + hmt_temp_threshold2 + '\'' +
                ", hmt_hum_threshold='" + hmt_hum_threshold + '\'' +
                ", hmt_space=" + hmt_space +
                ", hmt_ospace=" + hmt_ospace +
                '}';
    }
}
