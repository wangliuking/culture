package com.wlk.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/secure")
public class SecureController {

    @RequestMapping(method = RequestMethod.GET)
    public List<String> sayHello() {
        List<String> list = new ArrayList<>();
        list.add("wlk");
        list.add("very");
        list.add("good");
        return list;
    }

}
