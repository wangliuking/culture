import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
        List<String> list = Arrays.asList("a","b","c","d","e");
        /*List<String> output = list.stream().map(str->str.toUpperCase())
                .collect(Collectors.toList());
        System.out.println(output);*/
        List<String> output = list.stream().filter((str)->"e".equals(str) && "d".equals(str)).collect(Collectors.toList());
        System.out.println(output);
    }
}
