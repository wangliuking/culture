package com.wlk.bean;

public class RTU {
    private int site_id;
    private int rtu_id;
    private String rtu_ip;
    private String rtu_netmask;
    private String rtu_gateway;
    private String center_ip;
    private int center_port;
    private int connect_type;

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

    public String getRtu_ip() {
        return rtu_ip;
    }

    public void setRtu_ip(String rtu_ip) {
        this.rtu_ip = rtu_ip;
    }

    public String getRtu_netmask() {
        return rtu_netmask;
    }

    public void setRtu_netmask(String rtu_netmask) {
        this.rtu_netmask = rtu_netmask;
    }

    public String getRtu_gateway() {
        return rtu_gateway;
    }

    public void setRtu_gateway(String rtu_gateway) {
        this.rtu_gateway = rtu_gateway;
    }

    public String getCenter_ip() {
        return center_ip;
    }

    public void setCenter_ip(String center_ip) {
        this.center_ip = center_ip;
    }

    public int getCenter_port() {
        return center_port;
    }

    public void setCenter_port(int center_port) {
        this.center_port = center_port;
    }

    public int getConnect_type() {
        return connect_type;
    }

    public void setConnect_type(int connect_type) {
        this.connect_type = connect_type;
    }

    @Override
    public String toString() {
        return "RTU{" +
                "site_id=" + site_id +
                ", rtu_id=" + rtu_id +
                ", rtu_ip='" + rtu_ip + '\'' +
                ", rtu_netmask='" + rtu_netmask + '\'' +
                ", rtu_gateway='" + rtu_gateway + '\'' +
                ", center_ip='" + center_ip + '\'' +
                ", center_port=" + center_port +
                ", connect_type=" + connect_type +
                '}';
    }
}
