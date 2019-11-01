package run.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import run.bean.Role;
import run.mapper.RoleMapper;

import java.util.List;
import java.util.Map;

@Service
public class RoleService {
    @Autowired
    RoleMapper roleMapper;

    public Role selectRoleById(int id){
        return roleMapper.selectRoleById(id);
    }

    public List<Map<String,Object>> selectRoleList(Map<String,Object> param){
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

    public int updateRoleName(Role role){
        return roleMapper.updateRoleName(role);
    }

    public int deleteRole(int id){
        return roleMapper.deleteRole(id);
    }
}
