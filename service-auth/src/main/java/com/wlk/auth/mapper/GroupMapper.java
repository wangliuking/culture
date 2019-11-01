package com.wlk.auth.mapper;

import com.wlk.auth.entity.Group;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface GroupMapper {

    @Select("select * from user_group where id = #{id}")
    Group selectGroupById(int id);

    @Select("<script>" +
            "select * from user_group where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "limit #{start},#{limit}"+
            "</script>")
    List<Group> selectGroupList(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from user_group where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "</script>")
    int selectGroupListCount(Map<String, Object> param);

    @Insert("insert into user_group(name,roleId) values(#{name},#{roleId})")
    int insertGroup(Group group);

    @Update("update user_group set name=#{name} where id=#{id}")
    int updateGroup(Group group);

    @Delete("delete from user_group where id=#{id}")
    int deleteGroup(int id);
}
