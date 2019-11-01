package run.bean;

public class Lightning {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int ltn_id;
    private String ltn_name;
    private String ltn_model;
    private String ltn_location;
    private String ltn_threshold1;
    private String ltn_threshold2;
    private int ltn_times;
    private int ltn_space;
    private int ltn_ospace;

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

    public int getLtn_id() {
        return ltn_id;
    }

    public void setLtn_id(int ltn_id) {
        this.ltn_id = ltn_id;
    }

    public String getLtn_name() {
        return ltn_name;
    }

    public void setLtn_name(String ltn_name) {
        this.ltn_name = ltn_name;
    }

    public String getLtn_model() {
        return ltn_model;
    }

    public void setLtn_model(String ltn_model) {
        this.ltn_model = ltn_model;
    }

    public String getLtn_location() {
        return ltn_location;
    }

    public void setLtn_location(String ltn_location) {
        this.ltn_location = ltn_location;
    }

    public String getLtn_threshold1() {
        return ltn_threshold1;
    }

    public void setLtn_threshold1(String ltn_threshold1) {
        this.ltn_threshold1 = ltn_threshold1;
    }

    public String getLtn_threshold2() {
        return ltn_threshold2;
    }

    public void setLtn_threshold2(String ltn_threshold2) {
        this.ltn_threshold2 = ltn_threshold2;
    }

    public int getLtn_times() {
        return ltn_times;
    }

    public void setLtn_times(int ltn_times) {
        this.ltn_times = ltn_times;
    }

    public int getLtn_space() {
        return ltn_space;
    }

    public void setLtn_space(int ltn_space) {
        this.ltn_space = ltn_space;
    }

    public int getLtn_ospace() {
        return ltn_ospace;
    }

    public void setLtn_ospace(int ltn_ospace) {
        this.ltn_ospace = ltn_ospace;
    }

    @Override
    public String toString() {
        return "Lightning{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", ltn_id=" + ltn_id +
                ", ltn_name='" + ltn_name + '\'' +
                ", ltn_model='" + ltn_model + '\'' +
                ", ltn_location='" + ltn_location + '\'' +
                ", ltn_threshold1='" + ltn_threshold1 + '\'' +
                ", ltn_threshold2='" + ltn_threshold2 + '\'' +
                ", ltn_times=" + ltn_times +
                ", ltn_space=" + ltn_space +
                ", ltn_ospace=" + ltn_ospace +
                '}';
    }
}
