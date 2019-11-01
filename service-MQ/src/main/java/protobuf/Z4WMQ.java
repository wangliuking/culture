package protobuf;

import net.sf.json.JSONObject;
import org.apache.activemq.ActiveMQConnectionFactory;
import protobuf.jsonbean.DBInfo;
import protobuf.jsonbean.DeviceRES;
import protobuf.jsonbean.Values;
import run.controller.SendController;

import javax.jms.*;
import java.util.HashMap;
import java.util.Map;

public class Z4WMQ {
    public static void main(String[] args) {
        try {
            alarmMQ();
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    public static void alarmMQ() throws Exception {
        // 第一步：创建一个ConnectionFactory对象。
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(Conf.ip_port);
        // 第二步：从ConnectionFactory对象中获得一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接。调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象。和发送端保持一致queue，并且队列的名称一致。
        Queue queue = session.createQueue(Conf.z2w_MQ);
        // 第六步：使用Session对象创建一个Consumer对象。
        MessageConsumer consumer = session.createConsumer(queue);
        // 第七步：接收消息。
        consumer.setMessageListener(new MessageListener() {

            @Override
            public void onMessage(Message message) {
                try {
                    TextMessage textMessage = (TextMessage) message;
                    String text = null;
                    //取消息的内容
                    text = textMessage.getText();
                    JSONObject jsonObject = JSONObject.fromObject(text);
                    /*Map<String,Class> classMap = new HashMap<>();
                    classMap.put("DBInfo", DBInfo.class);
                    classMap.put("values", Values.class);
                    DeviceRES d = (DeviceRES) JSONObject.toBean(jsonObject,DeviceRES.class,classMap);*/
                    SendController.putMap(jsonObject.get("callId").toString(),jsonObject);
                    // 第八步：打印消息。
                    System.out.println("==================================");
                    System.out.println(jsonObject);
                    System.out.println("==================================");
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        });
        //等待键盘输入
        System.in.read();
        // 第九步：关闭资源
        consumer.close();
        session.close();
        connection.close();
    }
}
