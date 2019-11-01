package run.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import run.bean.Group;

import java.util.List;
import java.util.Map;

@Repository
public interface GroupMapper {

    @Select("select * from xhzh.user_group where id = #{id}")
    Group selectGroupById(int id);

    @Select("<script>" +
            "select * from xhzh.user_group where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "limit #{start},#{limit}"+
            "</script>")
    List<Group> selectGroupList(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from xhzh.user_group where 1=1 " +
            "<if test=\"param != null and param != ''\">" +
            "and name like concat('%',#{param},'%')" +
            "</if>" +
            "</script>")
    int selectGroupListCount(Map<String, Object> param);

    @Insert("insert into xhzh.user_group(name,roleId) values(#{name},#{roleId})")
    int insertGroup(Group group);

    @Update("update xhzh.user_group set name=#{name} where id=#{id}")
    int updateGroup(Group group);

    @Delete("delete from xhzh.user_group where id=#{id}")
    int deleteGroup(int id);
}
