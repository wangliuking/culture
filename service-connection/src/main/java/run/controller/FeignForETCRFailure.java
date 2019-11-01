package run.controller;

import org.springframework.stereotype.Service;

@Service
public class FeignForETCRFailure implements FeignForETCR {

    @Override
    public Object deleteETCR(String rtu_id,String rst_id,String rtu_port) {
        System.out.println("etcr service is not available !");
        return 0;
    }

    @Override
    public int selectETCRCountBySite(int site_id) {
        System.out.println("etcr service is not available !");
        return 0;
    }
}
