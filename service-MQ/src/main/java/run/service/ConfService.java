package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.*;
import run.mapper.ConfMapper;

import java.util.List;
import java.util.Map;

@Service
public class ConfService {
    @Autowired
    ConfMapper confMapper;

    public ETCR selectEtcrConf(Map<String,Object> params){
        return confMapper.selectEtcrConf(params);
    }

    public Static selectStaticConf(Map<String,Object> params){
        return confMapper.selectStaticConf(params);
    }

    public Stray selectStrayConf(Map<String,Object> params){
        return confMapper.selectStrayConf(params);
    }

    public Cat selectCatConf(Map<String,Object> params){
        return confMapper.selectCatConf(params);
    }
}
