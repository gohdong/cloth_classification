package woowang.clothesroute.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@NoArgsConstructor
public class UploadFile {
    @Id @GeneratedValue
    private long id;
    private String uploadName;
    private String storeFileName;

    private String gender;
    private String color;
    private String cate1;
    private String cate2;

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;

    public UploadFile(String uploadName, String storeFileName) {
        this.uploadName = uploadName;
        this.storeFileName = storeFileName;
        this.uploadDate = new Date();
    }
}
