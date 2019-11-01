package run.service;

import run.bean.Site;
import run.mapper.SiteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SiteService {
    @Autowired
    SiteMapper siteMapper;

    public List<Map<String,Object>> selectAllSite(Map<String,Object> param){
        return siteMapper.selectAllSite(param);
    }

    public int selectAllSiteCount(Map<String,Object> param){
        return siteMapper.selectAllSiteCount(param);
    }

    /*public List<Map<String,Object>> selectAllSite(Map<String,Object> param){
        return siteMapper.selectAllSite(param);
    }*/

    public Site selectSiteById(int id){
        return siteMapper.selectSiteById(id);
    }

    public int insertSite(Site site){
        return siteMapper.insertSite(site);
    }

    public int deleteSite(int id){
        return siteMapper.deleteSite(id);
    }

    public int updateSite(Site site){
        return siteMapper.updateSite(site);
    }
}
