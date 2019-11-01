FROM openjdk:10
VOLUME /tmp
COPY target/gateway-1.0-SNAPSHOT.jar gateway.jar
RUN bash -c "touch /gateway.jar"
EXPOSE 8080
ENTRYPOINT ["java","-jar","gateway.jar"]
