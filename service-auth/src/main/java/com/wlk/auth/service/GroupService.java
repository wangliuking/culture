package com.wlk.auth.service;

import com.wlk.auth.entity.Authority;
import com.wlk.auth.entity.Group;
import com.wlk.auth.mapper.GroupMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GroupService {
    @Autowired
    GroupMapper groupMapper;

    public Group selectGroupById(int id){
        return groupMapper.selectGroupById(id);
    }

    public List<Group> selectGroupList(Map<String,Object> param){
        return groupMapper.selectGroupList(param);
    }

    public int selectGroupListCount(Map<String,Object> param){
        return groupMapper.selectGroupListCount(param);
    }

    public int insertGroup(Group group){
        return groupMapper.insertGroup(group);
    }

    public int updateGroup(Group group){
        return groupMapper.updateGroup(group);
    }

    public int deleteGroup(int id){
        return groupMapper.deleteGroup(id);
    }
}
