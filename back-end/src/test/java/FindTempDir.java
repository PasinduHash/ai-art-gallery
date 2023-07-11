import java.util.Properties;

public class FindTempDir {

    public static void main(String[] args) {
        Properties properties = System.getProperties();
        for (Object key : properties.keySet()) {
            System.out.println(key);
        }
    }
}
