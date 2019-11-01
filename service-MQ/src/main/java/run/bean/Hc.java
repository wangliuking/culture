package run.bean;

public class Hc {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int es_id;
    private String es_name;
    private String es_model;
    private String es_location;
    private String es_i_threshold;
    private String es_temp_threshold;
    private String es_cur_threshold;
    private String es_vol_threshold;
    private int es_space;
    private int es_ospace;

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

    public int getEs_id() {
        return es_id;
    }

    public void setEs_id(int es_id) {
        this.es_id = es_id;
    }

    public String getEs_name() {
        return es_name;
    }

    public void setEs_name(String es_name) {
        this.es_name = es_name;
    }

    public String getEs_model() {
        return es_model;
    }

    public void setEs_model(String es_model) {
        this.es_model = es_model;
    }

    public String getEs_location() {
        return es_location;
    }

    public void setEs_location(String es_location) {
        this.es_location = es_location;
    }

    public String getEs_i_threshold() {
        return es_i_threshold;
    }

    public void setEs_i_threshold(String es_i_threshold) {
        this.es_i_threshold = es_i_threshold;
    }

    public String getEs_temp_threshold() {
        return es_temp_threshold;
    }

    public void setEs_temp_threshold(String es_temp_threshold) {
        this.es_temp_threshold = es_temp_threshold;
    }

    public String getEs_cur_threshold() {
        return es_cur_threshold;
    }

    public void setEs_cur_threshold(String es_cur_threshold) {
        this.es_cur_threshold = es_cur_threshold;
    }

    public String getEs_vol_threshold() {
        return es_vol_threshold;
    }

    public void setEs_vol_threshold(String es_vol_threshold) {
        this.es_vol_threshold = es_vol_threshold;
    }

    public int getEs_space() {
        return es_space;
    }

    public void setEs_space(int es_space) {
        this.es_space = es_space;
    }

    public int getEs_ospace() {
        return es_ospace;
    }

    public void setEs_ospace(int es_ospace) {
        this.es_ospace = es_ospace;
    }

    @Override
    public String toString() {
        return "Hc{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", es_id=" + es_id +
                ", es_name='" + es_name + '\'' +
                ", es_model='" + es_model + '\'' +
                ", es_location='" + es_location + '\'' +
                ", es_i_threshold='" + es_i_threshold + '\'' +
                ", es_temp_threshold='" + es_temp_threshold + '\'' +
                ", es_cur_threshold='" + es_cur_threshold + '\'' +
                ", es_vol_threshold='" + es_vol_threshold + '\'' +
                ", es_space=" + es_space +
                ", es_ospace=" + es_ospace +
                '}';
    }
}
