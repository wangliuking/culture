package protobuf.jsonbean;

public class Values {
    private String index;
    private String value;

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "Values{" +
                "index='" + index + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}
