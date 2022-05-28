package woowang.clothesroute.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import woowang.clothesroute.dto.UploadFile;
import woowang.clothesroute.repository.FileRepository;
import woowang.clothesroute.upload.FileStore;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class FileController {

    @Value("${request.url}")
    private String requestUrl;

    private final FileStore fileStore;
    private final FileRepository fileRepository;

    @PostMapping("/check")
    public ResponseEntity<String> getImage(@RequestParam("img") MultipartFile file) throws IOException {
        UploadFile uploadFile = fileStore.storeFile(file);

        fileRepository.save(uploadFile);

        log.info("file = {}",uploadFile);

//        TODO : 배경 삭제된 작업 처리

        ResponseEntity<String> exchange = sendRequest(uploadFile);
//        log.info("exchange = {}",exchange);

        return exchange;

    }

//    uploadName , gender ,color ,cate1, cate2 -> 리스트로 받아서 디비 업데이트
//    @PostMapping("/upload")
//    public String saveImage(@RequestBody List<String> imageNames){
//
//    }

    private ResponseEntity<String> sendRequest(UploadFile uploadFile) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("img", uploadFile.getStoreFileName());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type","application/json");
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> exchange = rt.exchange(
                requestUrl+"/check",
                HttpMethod.POST,
                entity,
                String.class
        );
        return exchange;
    }


}
