package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.mapper.WeChatMapper;

import java.util.List;
import java.util.Map;

@Service
public class WeChatService {
    @Autowired
    WeChatMapper weChatMapper;

    public List<Map<String,Object>> selectAllList(Map<String,Object> param){
        return weChatMapper.selectAllList(param);
    }

    public Map<String,Object> searchDetail(Map<String,Object> param){
        return weChatMapper.searchDetail(param);
    }

    public List<Map<String,Object>> searchCurrentNews(){
        return weChatMapper.searchCurrentNews();
    }
}
