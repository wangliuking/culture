package com.wlk.auth.service;

import com.wlk.auth.entity.Role;
import com.wlk.auth.mapper.RoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RoleService {
    @Autowired
    RoleMapper roleMapper;

    public Role selectRoleById(int id){
        return roleMapper.selectRoleById(id);
    }

    public List<Role> selectRoleList(Map<String,Object> param){
        return roleMapper.selectRoleList(param);
    }

    public int selectRoleListCount(Map<String,Object> param){
        return roleMapper.selectRoleListCount(param);
    }

    public int insertRole(Role role){
        return roleMapper.insertRole(role);
    }

    public int updateRole(Role role){
        return roleMapper.updateRole(role);
    }

    public int deleteRole(int id){
        return roleMapper.deleteRole(id);
    }
}
