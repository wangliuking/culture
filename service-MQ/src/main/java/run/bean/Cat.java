package run.bean;

public class Cat {
    private int site_id;
    private int rtu_id;
    private int rtu_port;
    private int rtu_baud_rate;
    private int cathode_id;
    private String cathode_name;
    private String cathode_model;
    private String cathode_location;
    private String cathode_paramter;
    private String cathode_threshold1;
    private String cathode_threshold2;
    private String fullscale;
    private String calvalue;
    private String factor;
    private int computeType;
    private int cathode_space;
    private int cathode_ospace;

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

    public int getCathode_id() {
        return cathode_id;
    }

    public void setCathode_id(int cathode_id) {
        this.cathode_id = cathode_id;
    }

    public String getCathode_name() {
        return cathode_name;
    }

    public void setCathode_name(String cathode_name) {
        this.cathode_name = cathode_name;
    }

    public String getCathode_model() {
        return cathode_model;
    }

    public void setCathode_model(String cathode_model) {
        this.cathode_model = cathode_model;
    }

    public String getCathode_location() {
        return cathode_location;
    }

    public void setCathode_location(String cathode_location) {
        this.cathode_location = cathode_location;
    }

    public String getCathode_paramter() {
        return cathode_paramter;
    }

    public void setCathode_paramter(String cathode_paramter) {
        this.cathode_paramter = cathode_paramter;
    }

    public String getCathode_threshold1() {
        return cathode_threshold1;
    }

    public void setCathode_threshold1(String cathode_threshold1) {
        this.cathode_threshold1 = cathode_threshold1;
    }

    public String getCathode_threshold2() {
        return cathode_threshold2;
    }

    public void setCathode_threshold2(String cathode_threshold2) {
        this.cathode_threshold2 = cathode_threshold2;
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

    public String getFactor() {
        return factor;
    }

    public void setFactor(String factor) {
        this.factor = factor;
    }

    public int getComputeType() {
        return computeType;
    }

    public void setComputeType(int computeType) {
        this.computeType = computeType;
    }

    public int getCathode_space() {
        return cathode_space;
    }

    public void setCathode_space(int cathode_space) {
        this.cathode_space = cathode_space;
    }

    public int getCathode_ospace() {
        return cathode_ospace;
    }

    public void setCathode_ospace(int cathode_ospace) {
        this.cathode_ospace = cathode_ospace;
    }

    @Override
    public String toString() {
        return "Cat{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_port=" + rtu_port +
                ", rtu_baud_rate=" + rtu_baud_rate +
                ", cathode_id=" + cathode_id +
                ", cathode_name='" + cathode_name + '\'' +
                ", cathode_model='" + cathode_model + '\'' +
                ", cathode_location='" + cathode_location + '\'' +
                ", cathode_paramter='" + cathode_paramter + '\'' +
                ", cathode_threshold1='" + cathode_threshold1 + '\'' +
                ", cathode_threshold2='" + cathode_threshold2 + '\'' +
                ", fullscale='" + fullscale + '\'' +
                ", calvalue='" + calvalue + '\'' +
                ", factor='" + factor + '\'' +
                ", computeType=" + computeType +
                ", cathode_space=" + cathode_space +
                ", cathode_ospace=" + cathode_ospace +
                '}';
    }
}
