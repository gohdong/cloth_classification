package woowang.clothesroute.api;

import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import woowang.clothesroute.dto.UploadFile;
import woowang.clothesroute.repository.FileRepository;
import woowang.clothesroute.upload.FileStore;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FileController {

    @Value("${requestNode.url}")
    private String requestNodeUrl;

    @Value("${requestFlask.url}")
    private String requestFlaskUrl;

    @Value("${rembgFile.dir}")
    private String rembgFileDir;

    private final FileStore fileStore;

    @PostMapping("/check")
    public ResponseEntity<String> getImage(@RequestParam("img") MultipartFile file) throws IOException, ImageProcessingException, MetadataException {
        UploadFile uploadFile = fileStore.storeFile(file);
        log.info("file = {}",uploadFile);

//        TODO : 배경 삭제 작업 처리
        byte[] imageBytes = sendFlaskRequest(uploadFile.getStoreFileName());

        // removed 폴더에 누끼딴 사진 저장
        Files.write(Paths.get(rembgFileDir+uploadFile.getStoreFileName()), imageBytes);

        ResponseEntity<String> nodeResponse = sendNodeRequest(uploadFile.getStoreFileName());

//        log.info("exchange = {}",exchange);

        return nodeResponse;

    }

//    uploadName , gender ,color ,cate1, cate2 -> 리스트로 받아서 디비 업데이트
//    @PostMapping("/upload")
//    public String saveImage(@RequestBody List<String> imageNames){
//
//    }

    private byte[] sendFlaskRequest(String uploadFileName){
        RestTemplate rt = new RestTemplate();
        ResponseEntity<byte[]> exchange = rt.getForEntity(
                requestFlaskUrl+uploadFileName,
                //TODO : Flask 서버 5000 가동
//                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg",
                byte[].class);
        return exchange.getBody();
//        return exchange;
    }

    private ResponseEntity<String> sendNodeRequest(String storeFileName) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("img", storeFileName);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type","application/json");
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> exchange = rt.exchange(
                requestNodeUrl,
                HttpMethod.POST,
                entity,
                String.class
        );
        return exchange;
    }


}
