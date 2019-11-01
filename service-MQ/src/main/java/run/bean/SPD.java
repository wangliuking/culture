package run.bean;

public class SPD {
    private int site_id;
    private int rtu_id;
    private int spd_map;
    private int spd_number;
    private String spd_name;
    private String spd_model;
    private String spd_location;
    private String spd_level;
    private int spd_space;

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

    public int getSpd_number() {
        return spd_number;
    }

    public void setSpd_number(int spd_number) {
        this.spd_number = spd_number;
    }

    public String getSpd_name() {
        return spd_name;
    }

    public void setSpd_name(String spd_name) {
        this.spd_name = spd_name;
    }

    public String getSpd_model() {
        return spd_model;
    }

    public void setSpd_model(String spd_model) {
        this.spd_model = spd_model;
    }

    public String getSpd_location() {
        return spd_location;
    }

    public void setSpd_location(String spd_location) {
        this.spd_location = spd_location;
    }

    public String getSpd_level() {
        return spd_level;
    }

    public void setSpd_level(String spd_level) {
        this.spd_level = spd_level;
    }

    public int getSpd_space() {
        return spd_space;
    }

    public void setSpd_space(int spd_space) {
        this.spd_space = spd_space;
    }

    public int getSpd_map() {
        return spd_map;
    }

    public void setSpd_map(int spd_map) {
        this.spd_map = spd_map;
    }

    @Override
    public String toString() {
        return "SPD{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", spd_map=" + spd_map +
                ", spd_number=" + spd_number +
                ", spd_name='" + spd_name + '\'' +
                ", spd_model='" + spd_model + '\'' +
                ", spd_location='" + spd_location + '\'' +
                ", spd_level='" + spd_level + '\'' +
                ", spd_space=" + spd_space +
                '}';
    }
}
