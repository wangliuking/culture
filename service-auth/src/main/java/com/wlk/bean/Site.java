package com.wlk.bean;

public class Site {
    private int site_id;
    private String site_name;
    private String site_industry;
    private String site_province;
    private String site_city;
    private String site_county;
    private String site_company;
    private String site_lat;
    private String site_lng;

    public int getSite_id() {
        return site_id;
    }

    public void setSite_id(int site_id) {
        this.site_id = site_id;
    }

    public String getSite_name() {
        return site_name;
    }

    public void setSite_name(String site_name) {
        this.site_name = site_name;
    }

    public String getSite_industry() {
        return site_industry;
    }

    public void setSite_industry(String site_industry) {
        this.site_industry = site_industry;
    }

    public String getSite_province() {
        return site_province;
    }

    public void setSite_province(String site_province) {
        this.site_province = site_province;
    }

    public String getSite_city() {
        return site_city;
    }

    public void setSite_city(String site_city) {
        this.site_city = site_city;
    }

    public String getSite_county() {
        return site_county;
    }

    public void setSite_county(String site_county) {
        this.site_county = site_county;
    }

    public String getSite_company() {
        return site_company;
    }

    public void setSite_company(String site_company) {
        this.site_company = site_company;
    }

    public String getSite_lat() {
        return site_lat;
    }

    public void setSite_lat(String site_lat) {
        this.site_lat = site_lat;
    }

    public String getSite_lng() {
        return site_lng;
    }

    public void setSite_lng(String site_lng) {
        this.site_lng = site_lng;
    }

    @Override
    public String toString() {
        return "Site{" +
                "site_id=" + site_id +
                ", site_name='" + site_name + '\'' +
                ", site_industry='" + site_industry + '\'' +
                ", site_province='" + site_province + '\'' +
                ", site_city='" + site_city + '\'' +
                ", site_county='" + site_county + '\'' +
                ", site_company='" + site_company + '\'' +
                ", site_lat='" + site_lat + '\'' +
                ", site_lng='" + site_lng + '\'' +
                '}';
    }
}
