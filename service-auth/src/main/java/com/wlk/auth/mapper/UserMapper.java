package com.wlk.auth.mapper;

import com.wlk.auth.entity.Authority;
import com.wlk.auth.entity.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public interface UserMapper {

    @Select("select * from user where username = #{username}")
    User selectUserByUsername(String username);

    @Select("select authority as name from user_authority where username = #{username}")
    List<Authority> selectAuthByUsername(String username);

    @Select("<script>" +
            "select a.*,b.name as groupName,c.name as roleName from user as a left join user_group as b on a.groupId=b.id " +
            "left join role as c on a.roleId=c.id where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and a.name like concat('%',#{param},'%') or username like concat('%',#{param},'%')" +
            "</if>" +
            "limit #{start},#{limit}"+
            "</script>")
    List<Map<String,Object>> selectUserList(Map<String,Object> param);

    @Select("<script>" +
            "select count(*) from user as a left join user_group as b on a.groupId=b.id " +
            "left join role as c on a.roleId=c.id where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and a.name like concat('%',#{param},'%') or username like concat('%',#{param},'%')" +
            "</if>" +
            "</script>")
    int selectUserListCount(Map<String,Object> param);

    @Insert("insert into user(username,name,password,email,groupId,roleId) values(#{username},#{name},#{password},#{email},#{groupId},#{roleId})")
    int insertUser(User user);

    @Update("update user set name=#{name},email=#{email},groupId=#{groupId},roleId=#{roleId} where username=#{username}")
    int updateUser(User user);

    @Delete("delete from user where username=#{username}")
    int deleteUser(String username);
}
