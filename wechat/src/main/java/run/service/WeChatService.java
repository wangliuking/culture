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



}
