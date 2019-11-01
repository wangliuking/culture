package run.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;
import run.bean.User;

import java.util.List;
import java.util.Map;

@Repository
public interface UserMapper {

    @Select("select * from xhzh.user where username = #{username}")
    User selectUserByUsername(String username);

    @Select("select count(*) from xhzh.user where username = #{username}")
    int selectCountUserByUsername(String username);

    @Select("<script>" +
            "select a.*,b.name as groupName,c.name as roleName from xhzh.user as a left join xhzh.user_group as b on a.groupId=b.id " +
            "left join xhzh.role as c on a.roleId=c.id where c.structure in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"param != null and param != ''\">" +
            "and a.name like concat('%',#{param},'%') or username like concat('%',#{param},'%')" +
            "</if>" +
            "limit #{start},#{limit}"+
            "</script>")
    List<Map<String,Object>> selectUserList(Map<String, Object> param);

    @Select("<script>" +
            "select count(*) from xhzh.user as a left join xhzh.user_group as b on a.groupId=b.id " +
            "left join xhzh.role as c on a.roleId=c.id where c.structure in " +
            "<foreach collection=\"strList\" index=\"index\" item=\"id\" open=\"(\" separator=\",\" close=\")\">"+
            "#{id}"+
            "</foreach>"+
            "<if test=\"param != null and param != ''\">" +
            "and a.name like concat('%',#{param},'%') or username like concat('%',#{param},'%')" +
            "</if>" +
            "</script>")
    int selectUserListCount(Map<String, Object> param);

    @Insert("insert into xhzh.user(username,name,password,email,groupId,roleId) values(#{username},#{name},#{password},#{email},#{groupId},#{roleId})")
    int insertUser(User user);

    @Update("update xhzh.user set username=#{username},password=#{password},name=#{name},email=#{email},groupId=#{groupId},roleId=#{roleId} where username=#{activationKey}")
    int updateUser(User user);

    @Delete("delete from xhzh.user where username=#{username}")
    int deleteUser(String username);
}
