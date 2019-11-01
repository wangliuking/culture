FROM openjdk:10
#VOLUME /tmp
#ADD target/eureka-server-1.0-SNAPSHOT.jar eureka-server.jar
#EXPOSE 8081
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/eureka-server.jar"]

VOLUME /tmp
COPY target/eureka-server-1.0-SNAPSHOT.jar eureka-server.jar
RUN bash -c "touch /eureka-server.jar"
EXPOSE 8081
ENTRYPOINT ["java","-jar","eureka-server.jar"]