package run;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @RequestMapping("/local")
    public String hello() {
        return "hello api gateway";
    }
}
