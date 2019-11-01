package com.wlk.auth.mapper;

import com.wlk.auth.entity.Role;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface RoleMapper {

    @Select("select * from role where id = #{id}")
    Role selectRoleById(int id);

    @Select("<script>" +
            "select * from role where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "limit #{start},#{limit}"+
            "</script>")
    List<Role> selectRoleList(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from role where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "</script>")
    int selectRoleListCount(Map<String, Object> param);

    @Insert("insert into role(name) values(#{name})")
    int insertRole(Role role);

    @Update("update role set name=#{name} where id=#{id}")
    int updateRole(Role role);

    @Delete("delete from role where id=#{id}")
    int deleteRole(int id);
}
