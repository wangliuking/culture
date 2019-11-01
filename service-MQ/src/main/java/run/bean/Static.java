package run.bean;

public class Static {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int staet_id;
    private String staet_name;
    private String staet_model;
    private String staet_location;
    private String staet_threshold1;
    private String staet_threshold2;
    private String staet_k;
    private String staet_v0;
    private int staet_space;
    private int staet_ospace;

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

    public int getStaet_id() {
        return staet_id;
    }

    public void setStaet_id(int staet_id) {
        this.staet_id = staet_id;
    }

    public String getStaet_name() {
        return staet_name;
    }

    public void setStaet_name(String staet_name) {
        this.staet_name = staet_name;
    }

    public String getStaet_model() {
        return staet_model;
    }

    public void setStaet_model(String staet_model) {
        this.staet_model = staet_model;
    }

    public String getStaet_location() {
        return staet_location;
    }

    public void setStaet_location(String staet_location) {
        this.staet_location = staet_location;
    }

    public String getStaet_threshold1() {
        return staet_threshold1;
    }

    public void setStaet_threshold1(String staet_threshold1) {
        this.staet_threshold1 = staet_threshold1;
    }

    public String getStaet_threshold2() {
        return staet_threshold2;
    }

    public void setStaet_threshold2(String staet_threshold2) {
        this.staet_threshold2 = staet_threshold2;
    }

    public String getStaet_k() {
        return staet_k;
    }

    public void setStaet_k(String staet_k) {
        this.staet_k = staet_k;
    }

    public String getStaet_v0() {
        return staet_v0;
    }

    public void setStaet_v0(String staet_v0) {
        this.staet_v0 = staet_v0;
    }

    public int getStaet_space() {
        return staet_space;
    }

    public void setStaet_space(int staet_space) {
        this.staet_space = staet_space;
    }

    public int getStaet_ospace() {
        return staet_ospace;
    }

    public void setStaet_ospace(int staet_ospace) {
        this.staet_ospace = staet_ospace;
    }

    @Override
    public String toString() {
        return "Static{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", staet_id=" + staet_id +
                ", staet_name='" + staet_name + '\'' +
                ", staet_model='" + staet_model + '\'' +
                ", staet_location='" + staet_location + '\'' +
                ", staet_threshold1='" + staet_threshold1 + '\'' +
                ", staet_threshold2='" + staet_threshold2 + '\'' +
                ", staet_k='" + staet_k + '\'' +
                ", staet_v0='" + staet_v0 + '\'' +
                ", staet_space=" + staet_space +
                ", staet_ospace=" + staet_ospace +
                '}';
    }
}
