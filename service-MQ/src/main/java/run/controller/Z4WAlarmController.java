package run.controller;

import net.sf.json.JSONObject;
import org.apache.activemq.ActiveMQConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import protobuf.Conf;
import protobuf.jsonbean.AlarmInfo;
import run.service.AlarmInfoService;
import javax.jms.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class Z4WAlarmController {
    @Autowired
    AlarmInfoService alarmInfoService;
    @Autowired
    private FeignForStructure feignForStructure;

    @RequestMapping(value = "/selectAllAlarmInfo",method = RequestMethod.GET)
    public Map<String,Object> selectAllAlarmInfo (HttpServletRequest req, HttpServletResponse resp){
        int start = -1;
        if(req.getParameter("start") != null && !"".equals(req.getParameter("start"))){
            start = Integer.parseInt(req.getParameter("start"));
        }
        int limit = -1;
        if(req.getParameter("limit") != null && !"".equals(req.getParameter("limit"))){
            limit = Integer.parseInt(req.getParameter("limit"));
        }
        int site_id = -1;
        if(req.getParameter("site_id") != null && !"".equals(req.getParameter("site_id"))){
            site_id = Integer.parseInt(req.getParameter("site_id"));
        }
        int rtuId = -1;
        if(req.getParameter("rtuId") != null && !"".equals(req.getParameter("rtuId"))){
            rtuId = Integer.parseInt(req.getParameter("rtuId"));
        }
        int type = -1;
        if(req.getParameter("type") != null && !"".equals(req.getParameter("type"))){
            type = Integer.parseInt(req.getParameter("type"));
        }
        int alarmStatus = -1;
        if(req.getParameter("alarmStatus") != null && !"".equals(req.getParameter("alarmStatus"))){
            alarmStatus = Integer.parseInt(req.getParameter("alarmStatus"));
        }
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        Map<String,Object> params = new HashMap<>();
        params.put("start",start);
        params.put("limit",limit);
        params.put("site_id",site_id);
        params.put("rtuId",rtuId);
        params.put("type",type);
        params.put("alarmStatus",alarmStatus);
        params.put("startTime",startTime);
        params.put("endTime",endTime);

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        params.put("strList",strList);

        List<Map<String,Object>> list = alarmInfoService.selectAllAlarmInfo(params);
        int count = alarmInfoService.selectAllAlarmInfoCount(params);

        Map<String,Object> listMap = new HashMap<>();
        listMap.put("items",list);
        listMap.put("totals",count);
        return listMap;

    }

    @RequestMapping(value = "/selectAllAlarmInfoNow",method = RequestMethod.GET)
    public Map<String,Object> selectAllAlarmInfoNow (HttpServletRequest req, HttpServletResponse resp){
        int start = -1;
        if(req.getParameter("start") != null && !"".equals(req.getParameter("start"))){
            start = Integer.parseInt(req.getParameter("start"));
        }
        int limit = -1;
        if(req.getParameter("limit") != null && !"".equals(req.getParameter("limit"))){
            limit = Integer.parseInt(req.getParameter("limit"));
        }
        int site_id = -1;
        if(req.getParameter("site_id") != null && !"".equals(req.getParameter("site_id"))){
            site_id = Integer.parseInt(req.getParameter("site_id"));
        }
        int rtuId = -1;
        if(req.getParameter("rtuId") != null && !"".equals(req.getParameter("rtuId"))){
            rtuId = Integer.parseInt(req.getParameter("rtuId"));
        }
        int type = -1;
        if(req.getParameter("type") != null && !"".equals(req.getParameter("type"))){
            type = Integer.parseInt(req.getParameter("type"));
        }
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        Map<String,Object> params = new HashMap<>();
        params.put("start",start);
        params.put("limit",limit);
        params.put("site_id",site_id);
        params.put("rtuId",rtuId);
        params.put("type",type);
        params.put("startTime",startTime);
        params.put("endTime",endTime);

        String structure = req.getParameter("structure");
        List<Integer> strList = feignForStructure.foreachIdAndPId(structure);
        System.out.println("strList : ++++++++++++"+strList);
        params.put("strList",strList);

        List<Map<String,Object>> list = alarmInfoService.selectAllAlarmInfoNow(params);
        int count = alarmInfoService.selectAllAlarmInfoNowCount(params);

        Map<String,Object> listMap = new HashMap<>();
        listMap.put("items",list);
        listMap.put("totals",count);
        return listMap;

    }

    void openTest(){
        //spd
        Thread threadSpd = new Thread(()->{
            System.out.println("SPDAlarm Running");
                try {
                alarmSPD();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadSpd.start();
        //spd
        //etcr
        Thread threadEtcr = new Thread(()->{
            System.out.println("EtcrAlarm Running");
            try {
                alarmEtcr();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadEtcr.start();
        //etcr
        //etcrb
        Thread threadEtcrB = new Thread(()->{
            System.out.println("EtcrBAlarm Running");
            try {
                alarmEtcrB();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadEtcrB.start();
        //etcrb
        //lightning
        Thread threadLightning = new Thread(()->{
            System.out.println("LightningAlarm Running");
            try {
                alarmLightning();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadLightning.start();
        //lightning
        //static
        Thread threadStatic = new Thread(()->{
            System.out.println("StaticAlarm Running");
            try {
                alarmStatic();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadStatic.start();
        //static
        //rsws
        Thread threadRsws = new Thread(()->{
            System.out.println("RswsAlarm Running");
            try {
                alarmRsws();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadRsws.start();
        //rsws
        //svt
        Thread threadSvt = new Thread(()->{
            System.out.println("SvtAlarm Running");
            try {
                alarmSvt();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadSvt.start();
        //svt
        //hc
        Thread threadHc = new Thread(()->{
            System.out.println("HcAlarm Running");
            try {
                alarmHc();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadHc.start();
        //hc
        //stray
        Thread threadStray = new Thread(()->{
            System.out.println("StrayAlarm Running");
            try {
                alarmStray();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadStray.start();
        //stray
        //cat
        Thread threadCat = new Thread(()->{
            System.out.println("CatAlarm Running");
            try {
                alarmCat();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadCat.start();
        //cat
        //rtuAlarm
        Thread threadRtuAlarm = new Thread(()->{
            System.out.println("RTUAlarm Running");
            try {
                rtuAlarm();
            }catch (Exception e){
                e.printStackTrace();
            }
        });
        threadRtuAlarm.start();
        //rtuAlarm
    }

    private void alarmSPD() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_SPD_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息
                System.out.println("==================================");
                d.setDevicetype(255);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmEtcr() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_ETCR_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(0);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmEtcrB() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_EtcrB_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(1);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmLightning() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Lct_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(2);
                System.out.println(d);
                //调用入库函数
                //alarmInfoService.insertAlarmInfo(d);
                //alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmStatic() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Mems_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(4);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmRsws() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_rsws_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(3);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmSvt() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Svt_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(5);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmHc() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Hc_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(6);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmStray() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Stray_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(7);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void alarmCat() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_Cathode_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                d.setDevicetype(8);
                System.out.println(d);
                //调用入库函数
                alarmInfoService.insertAlarmInfo(d);
                alarmInfoService.changeAlarmNow(d);
                System.out.println("==================================");
            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

    private void rtuAlarm() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_RTu_alarm);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener((message)->{
            try {
                TextMessage textMessage = (TextMessage) message;
                //取消息的内容
                String text = textMessage.getText();
                JSONObject jsonObject = JSONObject.fromObject(text);
                AlarmInfo d = (AlarmInfo) JSONObject.toBean(jsonObject, AlarmInfo.class);
                // 第八步：打印消息。
                System.out.println("==================================");
                System.out.println(d);
                System.out.println("==================================");
                //调用更新函数
                //判断是设备离线还是rtu离线
                if(d.getAlarmType() == 1){//设备离线
                    if(d.getDevicetype() == 0 || d.getDevicetype() == 1){
                        alarmInfoService.updateEtcrNow(d);
                    }else if(d.getDevicetype() == 2){
                        alarmInfoService.updateLightningNow(d);
                    }else if(d.getDevicetype() == 3){
                        alarmInfoService.updateRswsNow(d);
                    }else if(d.getDevicetype() == 4){
                        alarmInfoService.updateStaticNow(d);
                    }else if(d.getDevicetype() == 5){
                        alarmInfoService.updateSvtNow(d);
                    }else if(d.getDevicetype() == 6){
                        alarmInfoService.updateHcNow(d);
                    }else if(d.getDevicetype() == 7){
                        alarmInfoService.updateStrayNow(d);
                    }else if(d.getDevicetype() == 8){
                        alarmInfoService.updateCatNow(d);
                    }
                }

            } catch (JMSException e) {
                e.printStackTrace();
            }
        });
        //等待键盘输入
        /*System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();*/
    }

}
