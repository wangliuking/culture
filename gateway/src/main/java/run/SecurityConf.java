package run;

import feign.auth.BasicAuthRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) //开启security注解
public class SecurityConf extends WebSecurityConfigurerAdapter {

    @Bean
    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    //@Override
    protected void configure(HttpSecurity http) throws Exception {
        //允许所有用户访问"/"和"/home"
        /*http.authorizeRequests()
                .antMatchers("/feign/*").permitAll()
                //其他地址的访问均需验证权限
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login")  //指定登录页是"/login"
                .defaultSuccessUrl("/list")  //登录成功后默认跳转到"list"
                .permitAll()
                .and()
                .logout()
                .logoutSuccessUrl("/home")  //退出登录后的默认url是"/home"
                .permitAll();*/
        http.headers().frameOptions().disable();
        http.formLogin().loginPage("/xhzh/login.html").loginProcessingUrl("/login");//表单登录 自定义登录页面 自定义登录请求路径
        http.authorizeRequests()//请求权限配置
            .antMatchers("/xhzh/login.html").permitAll()
            .antMatchers("/feign/**").permitAll()
            .antMatchers("/connect/**").permitAll()
            .antMatchers("/loginOut").permitAll()
            .antMatchers("/selectMarquee").permitAll()
            .antMatchers("/updateMarquee").permitAll()
            .antMatchers("/getLoginUser").permitAll()
            .antMatchers("/selectLogList").permitAll()
            .antMatchers("/insertLog").permitAll()
            .antMatchers("/local/**").permitAll()
            .antMatchers("/login").permitAll()
            .antMatchers("/loginWeb").permitAll()
            .antMatchers("/auth/**").permitAll()
            .antMatchers("/spd/**").permitAll()
            .antMatchers("/etcr/**").permitAll()
            .antMatchers("/lightning/**").permitAll()
            .antMatchers("/static/**").permitAll()
            .antMatchers("/rsws/**").permitAll()
            .antMatchers("/svt/**").permitAll()
            .antMatchers("/hc/**").permitAll()
            .antMatchers("/stray/**").permitAll()
            .antMatchers("/cat/**").permitAll()
            .antMatchers("/alarm/**").permitAll()
            .antMatchers("/mq/**").permitAll()
            .antMatchers("/total/**").permitAll()
            .anyRequest()//所有请求
            .authenticated();//所有请求都进行权限验证
        http.csrf().disable();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        //解决静态资源被拦截的问题
        web.ignoring().antMatchers("/xhzh/**")
                      .antMatchers("/tiles/**");
    }
}