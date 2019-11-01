package run;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import run.redis.RedisTest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * zuul 的过滤器。
 *
 * @author hmilyylimh
 *
 * @version 0.0.1
 *
 * @date 2017/9/26
 *
 */
@Component
public class MyFilter extends ZuulFilter{

    private static final Logger log = LoggerFactory.getLogger(MyFilter.class);

    RestTemplate restTemplate = new RestTemplate();
    /**
     * 前置过滤器。
     *
     * 但是在 zuul 中定义了四种不同生命周期的过滤器类型：
     *
     *      1、pre：可以在请求被路由之前调用；
     *
     *      2、route：在路由请求时候被调用；
     *
     *      3、post：在route和error过滤器之后被调用；
     *
     *      4、error：处理请求时发生错误时被调用；
     *
     * @return
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤的优先级，数字越大，优先级越低。
     *
     * @return
     */
    @Override
    public int filterOrder() {
        return 1;
    }

    /**
     * 是否执行该过滤器。
     *
     * true：说明需要过滤；
     *
     * false：说明不要过滤；
     *
     * @return
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * 过滤器的具体逻辑。
     *
     * @return
     */
    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        HttpServletResponse response = ctx.getResponse();
        log.info("当前请求的session为："+request.getSession().getId());
        log.info("当前请求的url为："+request.getRequestURI());
        /*log.info(String.format("%s >>> %s", request.getMethod(), request.getRequestURL().toString()));
        Object accessToken = request.getParameter("access_token");
        log.info("accessToken : "+accessToken);
        if (accessToken != null) {
            return null;
        }
        log.warn("token is empty");
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(401);
        try {
            ctx.getResponse().getWriter().write("token is empty");
        } catch (Exception e) {
        }*/

        //请求验证
        if (!RedisTest.searchLoginUser(request.getSession().getId())) {
            String redirectUrl = "/xhzh/login.html";
            sendRedirect(ctx.getResponse(), redirectUrl);
        }
        return null;

    }

    private void sendRedirect(HttpServletResponse response, String redirectUrl){
        try {
            response.setHeader(HttpHeaders.LOCATION, redirectUrl);
            response.setStatus(HttpStatus.MOVED_PERMANENTLY.value());
            response.flushBuffer();
        } catch (IOException ex) {
            log.error("Could not redirect to: " + redirectUrl, ex);
        }
    }
}