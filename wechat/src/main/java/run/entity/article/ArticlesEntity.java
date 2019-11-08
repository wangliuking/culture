package run.entity.article;

import lombok.Data;

@Data
public class ArticlesEntity {

    private String title; //标题
    private String description;  //描述
    private String url;  //该图文的点击跳转链接
    private String picurl;  //图片的URL


}
