package run.controller;

import run.bean.User;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by admin on 2018/6/24.
 */
public class SendMail {
    public static void sendMail(User user){
        //做链接前的准备工作  也就是参数初始化
        Properties properties = new Properties();
        properties.setProperty("mail.smtp.host","smtp.qq.com");//发送邮箱服务器
        properties.setProperty("mail.smtp.port","465");//发送端口
        properties.setProperty("mail.smtp.auth","true");//是否开启权限控制
        properties.setProperty("mail.debug","true");//true 打印信息到控制台
        properties.setProperty("mail.transport","smtp");//发送的协议是简单的邮件传输协议
        properties.setProperty("mail.smtp.ssl.enable","true");
        //建立两点之间的链接
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("1287818687@qq.com","stfdcegsqlmebafb");
            }
        });
        //创建邮件对象
        Message message = new MimeMessage(session);
        //设置发件人
        try {
            message.setFrom(new InternetAddress("1287818687@qq.com"));

            //设置收件人
            message.setRecipient(Message.RecipientType.TO,new InternetAddress(user.getEmail()));//收件人
            //设置主题
            message.setSubject("用户变更");
            //设置邮件正文  第二个参数是邮件发送的类型
            message.setContent("平台用户配置出现变更<br>账号： "+user.getUsername()+"<br>密码： "+user.getPassword()+"<br>昵称： "+user.getName()+"<br>邮箱： "+user.getEmail()+"<br>网址： 39.104.240.180:8080","text/html;charset=UTF-8");
            //发送一封邮件
            Transport transport = session.getTransport();
            transport.connect("1287818687@qq.com","wangliukai201111");
            Transport.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }finally {

        }

    }

    public static void main(String[] args) {
        String str = "2426951348@qq.com";
        Pattern p = Pattern.compile("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
        Matcher m = p.matcher(str);
        if(m.find()){
            User user = new User();
            user.setUsername("wlk");
            user.setPassword("123456");
            user.setName("aaa");
            user.setEmail("2426951348@qq.com");
            SendMail.sendMail(user);
        }else{
            System.out.println("邮箱格式非法");
        }

    }
}

