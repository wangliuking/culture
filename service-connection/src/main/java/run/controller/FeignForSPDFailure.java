package run.controller;

import org.springframework.stereotype.Service;

@Service
public class FeignForSPDFailure implements FeignForSPD {
    @Override
    public String deleteSPDBySite(String site_id) {
        return null;
    }

    @Override
    public String deleteSPDByRTU(String rtu_id) {
        return null;
    }

    @Override
    public int selectSPDCountBySite(int site_id) {
        System.out.println("spd service is not available !");
        return 0;
    }

    @Override
    public Object deleteSPD(String rtu_id,String spd_number,String site_id) {
        System.out.println("spd service is not available !");
        return 0;
    }
}
