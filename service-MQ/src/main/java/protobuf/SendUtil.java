package protobuf;

import com.google.protobuf.InvalidProtocolBufferException;
import net.sf.json.JSONObject;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


public class SendUtil {
    public static void main(String[] args){

    }

    public static void sendMQ(JSONObject jsonObject,String ip_port,String queueMQ) throws Exception {
        // 第一步：创建ConnectionFactory对象，需要指定服务端ip及端口号。
        //brokerURL服务器的ip及端口号
        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(ip_port);
        // 第二步：使用ConnectionFactory对象创建一个Connection对象。
        Connection connection = connectionFactory.createConnection();
        // 第三步：开启连接，调用Connection对象的start方法。
        connection.start();
        // 第四步：使用Connection对象创建一个Session对象。
        //第一个参数：是否开启事务。true：开启事务，第二个参数忽略。
        //第二个参数：当第一个参数为false时，才有意义。消息的应答模式。1、自动应答2、手动应答。一般是自动应答。
        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
        // 第五步：使用Session对象创建一个Destination对象（topic、queue），此处创建一个Queue对象。
        //参数：队列的名称。
        Queue queue = session.createQueue(queueMQ);
        // 第六步：使用Session对象创建一个Producer对象。
        MessageProducer producer = session.createProducer(queue);
        // 第七步：创建一个Message对象，创建一个TextMessage对象。
        /*TextMessage message = new ActiveMQTextMessage();
        message.setText("hello activeMq,this is my first test.");*/
        TextMessage textMessage = session.createTextMessage(jsonObject.toString());
        // 第八步：使用Producer对象发送消息。
        producer.send(textMessage);
        // 第九步：关闭资源。
        producer.close();
        session.close();
        connection.close();
    }

    public static void test() {
        System.out.println("===== 构建一个XhRtu模型开始 =====");
        XhRtu.HeartBeatIN.Builder builder = XhRtu.HeartBeatIN.newBuilder();
        builder.setRtuid(2);
        builder.addSt(XhRtu.HeartBeatIN.RS485Status.newBuilder().setChanno(3).setDeviceid(20).setStnum(3));
        builder.addSt(XhRtu.HeartBeatIN.RS485Status.newBuilder().setChanno(4).setDeviceid(20).setStnum(3));

        XhRtu.HeartBeatIN heartBeatINProtoInfo = builder.build();

        System.out.println(heartBeatINProtoInfo.toString());
        System.out.println("===== 构建XhRtu模型结束 =====");

        System.out.println("===== heartBeatINProtoInfo Byte 开始=====");
        for(byte b : heartBeatINProtoInfo.toByteArray()){
            System.out.print(b);
        }
        System.out.println("\n" + "bytes长度" + heartBeatINProtoInfo.toByteString().size());
        System.out.println("===== heartBeatINProtoInfo Byte 结束 =====");

        System.out.println("===== 使用heartBeatINProtoInfo 反序列化生成对象开始 =====");


        XhRtu.HeartBeatIN heartBeatINInfo = null;
        try {
            heartBeatINInfo = XhRtu.HeartBeatIN.parseFrom(heartBeatINProtoInfo.toByteArray());
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
        System.out.println("RtuId is "+ heartBeatINInfo.getRtuid());
        List<XhRtu.HeartBeatIN.RS485Status> rs485StatusList = heartBeatINInfo.getStList();
        for (XhRtu.HeartBeatIN.RS485Status rs485Status : rs485StatusList)
        {
            System.out.println("Channo :"+rs485Status.getChanno()+" tDeviceid : "+ rs485Status.getDeviceid());
        }

        System.out.println("===== 使用heartBeatINProtoInfo反序列化生成对象结束 =====");

    }

    public static String RandomWord() {
        String[] beforeShuffle = new String[] { "1", "2", "3", "4", "5", "6",
                "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
                "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
                "V", "W", "X", "Y", "Z" };
        List list = Arrays.asList(beforeShuffle);
        Collections.shuffle(list);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i));
        }
        String afterShuffle = sb.toString();
        String result = afterShuffle.substring(1, 9);
        return result;
    }



}
