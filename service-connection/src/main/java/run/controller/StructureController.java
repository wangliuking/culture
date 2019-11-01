package run.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import run.bean.Node;
import run.service.StructureService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@RestController
public class StructureController {
    @Autowired
    private StructureService structureService;

    @RequestMapping(value = "/selectAllStructure")
    public List<Node> selectAllStructure (HttpServletRequest req){
        String structure = req.getParameter("structure");
        List<Integer> strList = foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        Map<String,Object> param = new HashMap<>();
        param.put("strList",strList);

        List<Node> nodeList = structureService.selectAll(param);
        TreeUtil treeUtil = new TreeUtil();
        List<Node> resultList = treeUtil.getInfiniteLevelTree(nodeList,Integer.parseInt(structure));
        return resultList;

    }

    @RequestMapping(value = "/selectStructureList")
    public Map<String,Object> selectStructureList (HttpServletRequest req){
        Map<String,Object> param = new HashMap<>();
        String industry = req.getParameter("industry");
        if(industry == null || "".equals(industry)){
            param.put("industry","");
        }else{
            param.put("industry",industry);
        }
        String structure = req.getParameter("structure");
        List<Integer> strList = foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);

        List<Map<String,Object>> nodeList = structureService.selectStructureList(param);
        List<Map<String,Object>> siteList = structureService.selectSiteListByIndustry(param);
        List<Map<String,Object>> rtuList = structureService.selectRTUListByIndustry(param);
        Map<String,Object> finalMap = new HashMap<>();
        finalMap.put("nodeList",nodeList);
        finalMap.put("siteList",siteList);
        finalMap.put("rtuList",rtuList);
        return finalMap;
    }

    @RequestMapping(value = "/selectRTUListByCompany")
    public Map<String,Object> selectRTUListByCompany (HttpServletRequest req){
        Map<String,Object> param = new HashMap<>();
        String site_company = req.getParameter("site_company");
        if(site_company == null || "".equals(site_company)){
            param.put("site_company","");
        }else{
            param.put("site_company",site_company);
        }
        String structure = req.getParameter("structure");
        List<Integer> strList = foreachIdAndPIdForConnection(Integer.parseInt(structure));
        System.out.println("strList : ++++++++++++"+strList);
        param.put("strList",strList);

        List<Map<String,Object>> rtuList = structureService.selectRTUListByCompany(param);
        Map<String,Object> finalMap = new HashMap<>();
        finalMap.put("rtuList",rtuList);
        return finalMap;
    }

    @RequestMapping(value = "/insertStructure")
    public Map<String, Object> insertStructure (@RequestBody Node node){
        Map<String,Object> params = new HashMap<>();
        System.out.println("node : "+node);
        int result = structureService.insert(node);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功添加了一个单位");
        }else {
            map.put("success",false);
            map.put("message","添加单位失败");
        }
        return map;
    }

    @RequestMapping(value = "/deleteStructure")
    public Map<String, Object> deleteStructure(HttpServletRequest req, HttpServletResponse resp){
        int id = Integer.parseInt(req.getParameter("id"));
        int res = structureService.delete(id);
        Map<String,Object> map = new HashMap<>();
        if(res>0){
            map.put("success",true);
            map.put("message","成功删除了该单位");
        }else {
            map.put("success",false);
            map.put("message","删除单位失败");
        }
        return map;
    }

    @RequestMapping(value = "/updateStructure")
    public Map<String, Object> updateStructure(HttpServletRequest req){
        String id = req.getParameter("id");
        String name = req.getParameter("name");
        Map<String,Object> param = new HashMap<>();
        param.put("id",id);
        param.put("name",name);
        int result = structureService.update(param);
        Map<String,Object> map = new HashMap<>();
        if(result>0){
            map.put("success",true);
            map.put("message","成功更新了该单位");
        }else {
            map.put("success",false);
            map.put("message","更新该单位失败");
        }
        return map;
    }

    @RequestMapping(value = "/foreachIdAndPId")
    public List<Integer> foreachIdAndPId (HttpServletRequest req){
        List<Map<String,Integer>> list = structureService.foreachIdAndPId();
        int id = Integer.parseInt(req.getParameter("id"));
        List<Integer> finalList = new LinkedList<>();
        List<Integer> tempList = new LinkedList<>();
        tempList.add(id);
        while(tempList.size()>0){
            List<Integer> otherList = new LinkedList<>();
            for(int i=0;i<tempList.size();i++){
                finalList.add(tempList.get(i));
                List<Integer> tList = getChildId(tempList.get(i),list);
                if(tList.size()>0){
                    for(int j=0;j<tList.size();j++){
                        otherList.add(tList.get(j));
                    }
                }
            }
            tempList.clear();
            for(int i=0;i<otherList.size();i++){
                tempList.add(otherList.get(i));
            }
        }
        return finalList;
    }

    public List<Integer> foreachIdAndPIdForConnection (int id){
        List<Map<String,Integer>> list = structureService.foreachIdAndPId();
        List<Integer> finalList = new LinkedList<>();
        List<Integer> tempList = new LinkedList<>();
        tempList.add(id);
        while(tempList.size()>0){
            List<Integer> otherList = new LinkedList<>();
            for(int i=0;i<tempList.size();i++){
                finalList.add(tempList.get(i));
                List<Integer> tList = getChildId(tempList.get(i),list);
                if(tList.size()>0){
                    for(int j=0;j<tList.size();j++){
                        otherList.add(tList.get(j));
                    }
                }
            }
            tempList.clear();
            for(int i=0;i<otherList.size();i++){
                tempList.add(otherList.get(i));
            }
        }
        return finalList;
    }

    public List<Integer> getChildId(int id,List<Map<String,Integer>> list){
        List<Integer> returnlist = new LinkedList<>();
        for(int i=0;i<list.size();i++){
            if(list.get(i).get("pId") == id){
                returnlist.add(list.get(i).get("id"));
            }
        }
        return returnlist;
    }
}
